const mockGetApplication = jest.fn();
const mockGetApplicationPage = jest.fn();
const mockListAllApplications = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

const mockedVonage = jest.fn().mockImplementation(() => {
  return {
    applications: {
      getApplication: mockGetApplication,
      getApplicationPage: mockGetApplicationPage,
      listAllApplications: mockListAllApplications,
    },
  };
});

mockedVonage._mockGetApplication = mockGetApplication;
mockedVonage._mockGetApplicationPage = mockGetApplicationPage;
mockedVonage._mockListAllApplications = mockListAllApplications;

exports.Vonage = mockedVonage;
