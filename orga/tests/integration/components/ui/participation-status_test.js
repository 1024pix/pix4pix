import { module, test } from 'qunit';
import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';
import { render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | Ui | ParticipationStatus', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('label', function () {
    test('it should display formatted label', async function (assert) {
      this.set('status', 'SHARED');
      this.set('campaignType', 'ASSESSMENT');

      // when
      await render(hbs`<Ui::ParticipationStatus @status={{this.status}} @campaignType={{this.campaignType}} />`);

      // then
      assert.contains(this.intl.t('components.participation-status.SHARED-ASSESSMENT'));
    });
  });
});
