const mockGetApplication = jest.fn();
const mockGetApplicationPage = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

const mockedVonage = jest.fn().mockImplementation(() => {
  return {
    applications: {
      getApplication: mockGetApplication,
      getApplicationPage: mockGetApplicationPage,
    },
  };
});

mockedVonage._mockGetApplication = mockGetApplication;
mockedVonage._mockGetApplicationPage = mockGetApplicationPage;
exports.Vonage = mockedVonage;
