import { apiKey, apiSecret } from '../credentialFlags.js';
import { json, yaml, force } from '../commonFlags.js';
import fetch from 'node-fetch';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { spinner } from '../ux/spinner.js';
import { hideCursor, resetCursor } from '../ux/cursor.js';
import { inputFromTTY } from '../ux/input.js';
import { EOL } from 'node:os';
import { createDirectory, writeFile } from '../utils/fs.js';
import { getSharedConfig, APISpecs } from '../middleware/config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const command = 'mock <api>';

export const desc = 'Launch a mock server for Vonage APIs using Prism';

export const builder = (yargs) => yargs
  .positional('api', {
    describe: 'The API to mock',
    choices: ['sms'],
    type: 'string',
  })
  .options({
    'port': {
      describe: 'Port to run the mock server on',
      type: 'number',
      default: 4010,
      group: 'Mock Server',
    },
    'host': {
      describe: 'Host to bind the mock server to',
      type: 'string',
      default: 'localhost',
      group: 'Mock Server',
    },
    'download-only': {
      describe: 'Only download the OpenAPI spec without starting the server',
      type: 'boolean',
      default: false,
      group: 'Mock Server',
    },
    'latest': {
      describe: 'Force re-download of the OpenAPI spec even if it already exists',
      type: 'boolean',
      default: false,
      group: 'Mock Server',
    },
    'api-key': apiKey,
    'api-secret': apiSecret,
    'force': force,
    'json': json,
    'yaml': yaml,
  })
  .example(
    'vonage mock sms',
    'Start a mock server for the SMS API on port 4010',
  )
  .example(
    'vonage mock sms --port 8080',
    'Start a mock server for the SMS API on port 8080',
  )
  .example(
    'vonage mock sms --download-only',
    'Download the SMS API spec without starting the server',
  )
  .example(
    'vonage mock sms --latest',
    'Force re-download the latest SMS API spec and start the server',
  );

export const handler = async (argv) => {
  const { api, port, host, downloadOnly, latest } = argv;

  console.info(`Setting up mock server for ${api.toUpperCase()} API`);

  // Create mock directory in the same location as CLI config (~/.vonage/mock)
  const mockDir = path.join(getSharedConfig().globalConfigPath, 'mock');
  const specPath = path.join(mockDir, `${api}-spec.json`);

  try {
    createDirectory(mockDir);
  } catch (error) {
    console.error('Failed to create mock directory:', error.message);
    throw new Error('Failed to create mock directory');
  }
  const specExists = existsSync(specPath);
  const shouldDownload = !specExists || latest;

  if (specExists && !latest) {
    console.log(`📋 Using cached ${api.toUpperCase()} API specification: ${specPath}`);
    if (downloadOnly) {
      console.log('Spec already exists. Use --latest to re-download the latest version.');
      console.log(`Spec location: ${specPath}`);
      return;
    }
  }

  // Download the OpenAPI spec if needed
  if (shouldDownload) {
    const { stop: stopDownload, fail: failDownload } = spinner({
      message: latest
        ? `Re-downloading latest ${api.toUpperCase()} API specification`
        : `Downloading ${api.toUpperCase()} API specification`,
    });

    try {
      const response = await fetch(APISpecs[api]);

      if (!response.ok) {
        throw new Error(`Failed to download spec: ${response.status} ${response.statusText}`);
      }

      const spec = await response.json();
      writeFile(specPath, JSON.stringify(spec, null, 2));
      stopDownload();

      const action = latest ? 'Re-downloaded' : 'Downloaded';
      console.log(`✅ ${action} ${api.toUpperCase()} API specification to ${specPath}`);
    } catch (error) {
      failDownload();
      console.error('Failed to download API specification:', error.message);
      throw new Error('Failed to download API specification');
    }
  }

  if (downloadOnly) {
    console.log('Spec download complete. Use the spec file with your preferred mock server.');
    console.log(`Spec saved to: ${specPath}`);
    return;
  }

  // Use the bundled Prism CLI
  const prismPath = path.join(__dirname, '..', '..', 'node_modules', '.bin', 'prism');

  // Start the Prism mock server
  console.log('');
  console.log(`🚀 Starting mock server for ${api.toUpperCase()} API`);
  console.log(`   Host: ${host}`);
  console.log(`   Port: ${port}`);
  console.log(`   Spec: ${specPath}`);
  console.log('   Using bundled Prism CLI');
  console.log('');

  const prismArgs = ['mock', specPath, '--port', port.toString(), '--host', host];
  const prismProcess = spawn(prismPath, prismArgs, {
    stdio: ['pipe', 'inherit', 'inherit'],
  });

  prismProcess.on('error', (error) => {
    console.error('Failed to start Prism:', error.message);
    console.log('');
    console.log('If you encounter issues, you can also run Prism manually:');
    console.log(`  npx @stoplight/prism-cli mock ${specPath} --port ${port} --host ${host}`);
    throw new Error('Failed to start Prism mock server');
  });

  // Give Prism a moment to start
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log(`✅ Mock server is running at http://${host}:${port}`);
  console.log('');
  console.log('Available endpoints will be automatically generated based on the OpenAPI spec.');
  console.log('Check the Prism output above for specific endpoint details.');
  console.log('');

  hideCursor();
  process.stdout.write('Press q to quit');

  const controller = new AbortController();
  try {
    await inputFromTTY({
      signal: controller.signal,
      echo: false,
      onKeyPress: (_, str) => {
        if (str !== 'q') {
          return;
        }

        controller.abort('Shutdown');
        process.stdout.write(EOL);
      },
    });
  } catch (err) {
    if (String(err) !== 'Shutdown') {
      console.error('Unexpected error', err);
    }
  } finally {
    console.log('');
    console.log('🛑 Shutting down mock server...');

    prismProcess.kill('SIGTERM');

    // Give the process time to shut down gracefully
    setTimeout(() => {
      if (!prismProcess.killed) {
        prismProcess.kill('SIGKILL');
      }
    }, 5000);

    resetCursor();
    console.log('Mock server stopped.');
  }
};
