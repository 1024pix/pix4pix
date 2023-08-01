import { ForbiddenAccess, UnexpectedOidcStateError } from '../../errors.js';
import { logger } from '../../../infrastructure/logger.js';
import { PIX_ADMIN } from '../../constants.js';

const authenticateOidcUser = async function ({
  stateReceived,
  stateSent,
  code,
  redirectUri,
  scope,
  oidcAuthenticationService,
  authenticationSessionService,
  authenticationMethodRepository,
  userRepository,
  adminMemberRepository,
}) {
  if (stateSent !== stateReceived) {
    logger.error(`State sent ${stateSent} did not match the state received ${stateReceived}`);
    throw new UnexpectedOidcStateError();
  }

  const sessionContent = await oidcAuthenticationService.exchangeCodeForTokens({ code, redirectUri });
  const userInfo = await oidcAuthenticationService.getUserInfo({
    idToken: sessionContent.idToken,
    accessToken: sessionContent.accessToken,
  });
  const user = await userRepository.findByExternalIdentifier({
    externalIdentityId: userInfo.externalIdentityId,
    identityProvider: oidcAuthenticationService.identityProvider,
  });

  if (!user) {
    const authenticationKey = await authenticationSessionService.save({ userInfo, sessionContent });
    const { firstName: givenName, lastName: familyName } = userInfo;
    return { authenticationKey, givenName, familyName, isAuthenticationComplete: false };
  }

  await _checkUserAccessScope({ scope, user, adminMemberRepository });

  await _updateAuthenticationMethodWithComplement({
    userInfo,
    userId: user.id,
    sessionContent,
    oidcAuthenticationService,
    authenticationMethodRepository,
  });

  const pixAccessToken = oidcAuthenticationService.createAccessToken(user.id);
  const logoutUrlUUID = await oidcAuthenticationService.saveIdToken({
    idToken: sessionContent.idToken,
    userId: user.id,
  });
  userRepository.updateLastLoggedAt({ userId: user.id });

  return { pixAccessToken, logoutUrlUUID, isAuthenticationComplete: true };
};

export { authenticateOidcUser };

async function _updateAuthenticationMethodWithComplement({
  userId,
  sessionContent,
  oidcAuthenticationService,
  authenticationMethodRepository,
}) {
  const authenticationComplement = oidcAuthenticationService.createAuthenticationComplement({ sessionContent });
  if (!authenticationComplement) return;

  return await authenticationMethodRepository.updateAuthenticationComplementByUserIdAndIdentityProvider({
    authenticationComplement,
    userId,
    identityProvider: oidcAuthenticationService.identityProvider,
  });
}

async function _checkUserAccessScope({ scope, user, adminMemberRepository }) {
  if (scope === PIX_ADMIN.SCOPE) {
    const adminMember = await adminMemberRepository.get({ userId: user.id });
    if (!adminMember?.hasAccessToAdminScope) {
      throw new ForbiddenAccess(PIX_ADMIN.NOT_ALLOWED_MSG);
    }
  }
}
