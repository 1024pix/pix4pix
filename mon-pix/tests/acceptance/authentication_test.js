import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { currentURL } from '@ember/test-helpers';
import { visit } from '@1024pix/ember-testing-library';
import { setupMirage } from 'ember-cli-mirage/test-support';
import setupIntl from '../helpers/setup-intl';

module('Acceptance | Authentication', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  module('Success cases', function () {
    module('Accessing to the default page page while disconnected', function () {
      test('should redirect to the connexion page', async function (assert) {
        // when
        await visit('/');

        // then
        assert.strictEqual(currentURL(), '/connexion');
      });
    });
  });
});
