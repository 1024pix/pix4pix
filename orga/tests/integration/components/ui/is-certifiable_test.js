import { module, test } from 'qunit';
import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';
import { render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | Ui | IsCertifiable', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display participant as eligible for certification', async function (assert) {
    // when
    await render(hbs`<Ui::IsCertifiable @isCertifiable={{true}} />`);

    // then
    assert.contains(this.intl.t('pages.sco-organization-participants.table.column.is-certifiable.eligible'));
  });

  test('it should display participant as non eligible for certification', async function (assert) {
    // when
    await render(hbs`<Ui::IsCertifiable @isCertifiable={{false}} />`);

    // then
    assert.contains(this.intl.t('pages.sco-organization-participants.table.column.is-certifiable.non-eligible'));
  });

  test('it should display participant with not available information about eligibility for certification', async function (assert) {
    // when
    await render(hbs`<Ui::IsCertifiable @isCertifiable={{null}} />`);

    // then
    assert.contains(this.intl.t('pages.sco-organization-participants.table.column.is-certifiable.not-available'));
  });
});
