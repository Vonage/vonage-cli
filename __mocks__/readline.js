afterEach(() => {
  jest.clearAllMocks();
});

const readline = jest.createMockFromModule('readline');
const questionMock = jest.fn();

const closeMock = jest.fn().mockImplementation(() => undefined);

const createInterface = jest.fn().mockReturnValue({
  question: questionMock,
  close: closeMock,
});

readline.createInterface = createInterface;

readline.__questionMock = questionMock;
readline.__closeMock = closeMock;
readline.__createInterfaceMock = createInterface;

module.exports = readline;
