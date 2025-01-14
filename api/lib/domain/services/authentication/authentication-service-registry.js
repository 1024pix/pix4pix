import { InvalidIdentityProviderError } from '../../errors.js';
import { PoleEmploiOidcAuthenticationService } from './pole-emploi-oidc-authentication-service.js';
import { CnavOidcAuthenticationService } from './cnav-oidc-authentication-service.js';
import { FwbOidcAuthenticationService } from './fwb-oidc-authentication-service.js';
import { GoogleOidcAuthenticationService } from './GoogleOidcAuthenticationService.js';

const oidcProviderServices = [
  new PoleEmploiOidcAuthenticationService(),
  new CnavOidcAuthenticationService(),
  new FwbOidcAuthenticationService(),
  new GoogleOidcAuthenticationService(),
].filter((oidcProvider) => oidcProvider.isReady);

const oidcProviderServiceMap = oidcProviderServices.reduce(_associateServiceToCode, {});
function _associateServiceToCode(map, service) {
  return {
    ...map,
    [service.code]: service,
  };
}

const oidcProviderServiceCodes = Object.keys(oidcProviderServiceMap);

function getOidcProviderServices() {
  return Object.values(oidcProviderServiceMap);
}

function getOidcProviderServiceByCode(identityProvider) {
  if (!oidcProviderServiceCodes.includes(identityProvider)) throw new InvalidIdentityProviderError(identityProvider);

  return oidcProviderServiceMap[identityProvider];
}

export { getOidcProviderServices, getOidcProviderServiceByCode };
