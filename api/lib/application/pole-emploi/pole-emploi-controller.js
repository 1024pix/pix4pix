const usecases = require('../../domain/usecases');
const userRepository = require('../../infrastructure/repositories/user-repository');
const AuthenticationMethod = require('../../domain/models/AuthenticationMethod');
const poleEmploiAuthenticationService = require('../../../lib/domain/services/authentication/pole-emploi-authentication-service');
const authenticationRegistry = require('../../domain/services/authentication/authentication-service-registry');

module.exports = {
  async createUser(request, h) {
    const authenticationKey = request.query['authentication-key'];

    const { userId, idToken } = await usecases.createUserFromExternalIdentityProvider({
      authenticationKey,
      identityProvider: AuthenticationMethod.identityProviders.POLE_EMPLOI,
    });

    const oidcAuthenticationService = authenticationRegistry.lookupAuthenticationService(
      AuthenticationMethod.identityProviders.POLE_EMPLOI
    );
    const accessToken = oidcAuthenticationService.createAccessToken(userId);
    const logoutUrlUUID = await poleEmploiAuthenticationService.saveIdToken({ idToken, userId });
    await userRepository.updateLastLoggedAt({ userId });

    const response = {
      access_token: accessToken,
      logout_url_uuid: logoutUrlUUID,
    };
    return h.response(response).code(200);
  },

  async getSendings(request, h) {
    const cursor = request.query.curseur;
    const filters = _extractFilters(request);
    const { sendings, link } = await usecases.getPoleEmploiSendings({ cursor, filters });
    return h.response(sendings).header('link', link).code(200);
  },

  async getAuthenticationUrl(request, h) {
    const oidcAuthenticationService = authenticationRegistry.lookupAuthenticationService(
      AuthenticationMethod.identityProviders.POLE_EMPLOI
    );
    const result = oidcAuthenticationService.getAuthenticationUrl({
      redirectUri: request.query['redirect_uri'],
    });
    return h.response(result).code(200);
  },
};

function _extractFilters(request) {
  const filters = {};
  if (Object.keys(request.query).includes('enErreur')) {
    filters.isSuccessful = !request.query.enErreur;
  }
  return filters;
}
