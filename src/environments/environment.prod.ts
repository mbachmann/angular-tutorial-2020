import {Environment} from './environment.model';

// not for local serve/run!! (-> environment.prod-local.ts)

export const environment: Environment = {
  production: true,
  useMockBackend: false,
  version: '_VERSION_',
  endpoints: {
    backendBaseUrl: '_BACKEND_BASE_URL_',
    backendAuthUrl: '_BACKEND_AUTH_URL_'
  }
}
