import { module, test } from 'qunit';
import { hbs } from 'ember-cli-htmlbars';
import { render } from '@1024pix/ember-testing-library';

import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';

module('Integration | Component | signin form', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('Rendering', function () {
    module('oidc connect button', function () {
      test('only displays a Google button', async function (assert) {
        // given & when
        const screen = await render(hbs`<SigninForm />`);

        // then
        assert
          .dom(
            screen.getByRole('link', {
              name: `${this.intl.t('pages.sign-in.google.link.img')} ${this.intl.t('pages.sign-in.google.title')}`,
            })
          )
          .hasAttribute('href', '/connexion/google');
      });
    });
  });
});
