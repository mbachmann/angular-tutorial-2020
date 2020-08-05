export interface Environment {
  production: boolean;
  useMockBackend: boolean;
  version: string;
  endpoints: {
    backendBaseUrl: string;
    backendAuthUrl: string;
  };
}
