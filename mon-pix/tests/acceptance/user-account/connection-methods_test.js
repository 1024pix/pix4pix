import { module, test } from 'qunit';
import { authenticate } from '../../helpers/authentication';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { visit } from '@1024pix/ember-testing-library';
import setupIntl from '../../helpers/setup-intl';

module('Acceptance | user-account | connection-methods', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  module('connection method details', function () {
    test("should display user's email", async function (assert) {
      // given
      const userDetails = { email: 'john.doe@example.net' };
      const user = server.create('user', 'withEmail', userDetails);
      server.create('authentication-method', 'withPixIdentityProvider', { user });
      await authenticate(user);

      // when
      const screen = await visit('/mon-compte/methodes-de-connexion');

      // then
      assert.ok(screen.getByText(user.email));
    });

    test("should display user's OIDC authentication methods", async function (assert) {
      // given
      const userDetails = {
        email: 'john.doe@example.net',
      };
      const user = server.create('user', 'withEmail', userDetails);
      server.create('authentication-method', 'withGenericOidcIdentityProvider', { user });

      // when
      await authenticate(user);
      const screen = await visit('/mon-compte/methodes-de-connexion');

      // then
      assert.ok(screen.getByText(this.intl.t('pages.user-account.connexion-methods.authentication-methods.label')));
      assert.ok(screen.getByText('via Partenaire OIDC'));
    });
  });
});
