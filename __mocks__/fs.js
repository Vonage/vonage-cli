const path = require('path');

let mockFiles = {};

afterEach(() => {
  jest.clearAllMocks();
  mockFiles = {};
});

const fs = jest.createMockFromModule('fs');

const __addPath = (filePath) => {
  if (!mockFiles[filePath]) {
    mockFiles[filePath] = {};
  }
};

const __addFile = (filePath, data) => {
  const pathName = path.dirname(filePath);
  const fileName = path.basename(filePath);

  __addPath(pathName);

  mockFiles[pathName][fileName] = data;
};

const mkdir = jest.fn((directoryPath) => {
  __addPath(directoryPath);
});

const mkdirSync = jest.fn((directoryPath) => {
  __addPath(directoryPath);
});

const readdirSync = jest.fn((directoryPath) => mockFiles[directoryPath] || []);

const existsSync = jest.fn((filePath) => {
  if (mockFiles[filePath]) {
    return true;
  }

  const pathName = path.dirname(filePath);
  const fileName = path.basename(filePath);

  if (!mockFiles[pathName]) {
    return false;
  }

  return !!mockFiles[pathName][fileName];
});

const readFileSync = (filePath) => {
  const pathName = path.dirname(filePath);
  const fileName = path.basename(filePath);

  if (!mockFiles[pathName] || !mockFiles[pathName][fileName]) {
    throw new Error(`ENOENT: no such file or directory, open '${filePath}'`);
  }

  return mockFiles[pathName][fileName];
};

fs.__addFile = __addFile;
fs.__addPath = __addPath;
fs.readFileSync = readFileSync;
fs.readdirSync = readdirSync;
fs.existsSync = existsSync;
fs.writeFileSync = jest.fn();
fs.mkdir = mkdir;
fs.mkdirSync = mkdirSync;

module.exports = fs;
