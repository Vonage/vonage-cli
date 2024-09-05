const path = require('path');

const fs = jest.createMockFromModule('fs');

let mockFiles = {};

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

const readdirSync = jest.fn((directoryPath) => mockFiles[directoryPath] || []);

const existsSync = jest.fn((filePath) => {
  const pathName = path.dirname(filePath);
  const fileName = path.basename(filePath);

  if (!mockFiles[pathName]) {
    return false;
  }

  return !!mockFiles[pathName][fileName];
});

fs.__addFile = __addFile;
fs.__addPath = __addPath;
fs.readdirSync = readdirSync;
fs.existsSync = existsSync;
fs.writeFileSync = jest.fn();

module.exports = fs;
