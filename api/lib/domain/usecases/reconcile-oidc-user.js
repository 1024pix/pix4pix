import { AuthenticationKeyExpired, DifferentExternalIdentifierError } from '../errors.js';
import { AuthenticationMethod } from '../models/index.js';

const reconcileOidcUser = async function ({
  email,
  password,
  identityProvider,
  authenticationKey,
  oidcAuthenticationService,
  authenticationSessionService,
  pixAuthenticationService,
  authenticationMethodRepository,
  userRepository,
}) {
  const sessionContentAndUserInfo = await authenticationSessionService.getByKey(authenticationKey);
  if (!sessionContentAndUserInfo) {
    throw new AuthenticationKeyExpired();
  }

  const foundUser = await pixAuthenticationService.getUserByUsernameAndPassword({
    username: email,
    password,
    userRepository,
  });

  const authenticationMethods = await authenticationMethodRepository.findByUserId({ userId: foundUser.id });
  const oidcAuthenticationMethod = authenticationMethods.find(
    (authenticationMethod) => authenticationMethod.identityProvider === identityProvider
  );

  const isSameExternalIdentifier =
    oidcAuthenticationMethod?.externalIdentifier === sessionContentAndUserInfo.userInfo.externalIdentityId;
  if (oidcAuthenticationMethod && !isSameExternalIdentifier) {
    throw new DifferentExternalIdentifierError();
  }

  const userId = foundUser.id;

  const { userInfo, sessionContent } = sessionContentAndUserInfo;
  const { externalIdentityId } = userInfo;

  const authenticationComplement = oidcAuthenticationService.createAuthenticationComplement({ sessionContent });
  await authenticationMethodRepository.create({
    authenticationMethod: new AuthenticationMethod({
      identityProvider: oidcAuthenticationService.identityProvider,
      userId,
      externalIdentifier: externalIdentityId,
      authenticationComplement,
    }),
  });

  const accessToken = await oidcAuthenticationService.createAccessToken(userId);
  const logoutUrlUUID = await oidcAuthenticationService.saveIdToken({
    idToken: sessionContent.idToken,
    userId,
  });
  userRepository.updateLastLoggedAt({ userId });

  return { accessToken, logoutUrlUUID };
};

export { reconcileOidcUser };
