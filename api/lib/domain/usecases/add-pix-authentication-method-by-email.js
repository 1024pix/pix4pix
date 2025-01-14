import { AuthenticationMethodAlreadyExistsError } from '../errors.js';
import { AuthenticationMethod } from '../models/AuthenticationMethod.js';
import { NON_OIDC_IDENTITY_PROVIDERS } from '../constants/identity-providers.js';

const addPixAuthenticationMethodByEmail = async function ({
  userId,
  email,
  passwordGenerator,
  encryptionService,
  userRepository,
  authenticationMethodRepository,
}) {
  await userRepository.checkIfEmailIsAvailable(email);

  const alreadyHasPixAuthenticationMethod = await authenticationMethodRepository.hasIdentityProviderPIX({ userId });

  if (alreadyHasPixAuthenticationMethod) {
    throw new AuthenticationMethodAlreadyExistsError();
  } else {
    const generatedPassword = passwordGenerator.generateComplexPassword();
    const hashedPassword = await encryptionService.hashPassword(generatedPassword);

    const authenticationMethodFromPix = new AuthenticationMethod({
      userId,
      identityProvider: NON_OIDC_IDENTITY_PROVIDERS.PIX.code,
      authenticationComplement: new AuthenticationMethod.PixAuthenticationComplement({
        password: hashedPassword,
        shouldChangePassword: false,
      }),
    });
    await authenticationMethodRepository.create({ authenticationMethod: authenticationMethodFromPix });
    await userRepository.updateUserDetailsForAdministration({ id: userId, userAttributes: { email } });
    return userRepository.getUserDetailsForAdmin(userId);
  }
};

export { addPixAuthenticationMethodByEmail };
