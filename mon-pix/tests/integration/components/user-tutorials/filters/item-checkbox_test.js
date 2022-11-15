import { module, test } from 'qunit';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | User-Tutorials | Filters | ItemCheckbox', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('when currentFilters contains item', function () {
    test('should show checked checkbox', async function (assert) {
      // given
      this.set('item', { id: 'competencesId', name: 'Ma super compétence' });
      this.set('currentFilters', { competences: ['competencesId'] });
      this.set('handleFilterChange', () => {});

      // when
      await render(
        hbs`<UserTutorials::Filters::ItemCheckbox
              @type="competences"
              @item={{this.item}}
              @currentFilters={{this.currentFilters}}
              @handleFilterChange={{this.handleFilterChange}}
            />`
      );

      // then
      assert.equal(find('input').checked, true);
    });
  });

  module('when currentFilters not contains item', function () {
    test('should show not checked checkbox', async function (assert) {
      // given
      this.set('item', { id: 'competencesId', name: 'Ma super compétence' });
      this.set('currentFilters', { competences: [] });
      this.set('handleFilterChange', () => {});

      // when
      await render(
        hbs`<UserTutorials::Filters::ItemCheckbox
              @type="competences"
              @item={{this.item}}
              @currentFilters={{this.currentFilters}}
              @handleFilterChange={{this.handleFilterChange}}
            />`
      );

      // then
      assert.equal(find('input').checked, false);
    });
  });
});
