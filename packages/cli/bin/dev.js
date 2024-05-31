import {execute, settings} from '@oclif/core';

settings.performanceEnabled = true;

await execute({development: true, dir: import.meta.url});
