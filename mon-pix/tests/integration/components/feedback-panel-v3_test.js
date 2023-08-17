import { module, test } from 'qunit';
import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';
import { click } from '@ember/test-helpers';
import { render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';

module('Integration | Component | feedback-panel-v3', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('Default rendering', function () {
    test('should not display the feedback panel', async function (assert) {
      // given & when
      const store = this.owner.lookup('service:store');
      const mockAssessment = store.createRecord('assessment', {
        state: 'started',
      });
      this.set('assessment', mockAssessment);

      const screen = await render(hbs`<FeedbackPanelV3 @assessment={{this.assessment}} />`);

      // then
      assert.dom(screen.queryByText('Êtes-vous sûr(e) de vouloir signaler un problème ?')).doesNotExist();
    });

    module('when warning the invigilator', function () {
      test('should close the panel if the candidate decides to return to the challenge', async function (assert) {
        // given
        const store = this.owner.lookup('service:store');
        const disableChallengeItemActions = sinon.stub();
        const mockAssessment = store.createRecord('assessment', {
          state: 'started',
        });
        this.set('assessment', mockAssessment);
        this.set('disableChallengeActions', disableChallengeItemActions);
        const screen = await render(
          hbs`<FeedbackPanelV3 @disableChallengeActions={{this.disableChallengeActions}} @assessment={{this.assessment}}/>`,
        );

        // when
        await click(screen.getByRole('button', { name: 'Signaler un problème avec la question' }));
        assert.dom(screen.getByText('Êtes-vous sûr(e) de vouloir signaler un problème ?')).exists();

        await click(screen.getByRole('button', { name: "Non, je reviens à l'épreuve" }));

        // then
        assert.dom(screen.queryByText('Êtes-vous sûr(e) de vouloir signaler un problème ?')).doesNotExist();
      });

      module('when the candidate decides to report a problem', function () {
        test('should display a notification', async function (assert) {
          // given
          const store = this.owner.lookup('service:store');
          const disableChallengeItemActions = sinon.stub();
          this.set('disableChallengeActions', disableChallengeItemActions);

          const mockAssessment = store.createRecord('assessment', {
            state: 'paused',
          });
          this.set('assessment', mockAssessment);

          const screen = await render(
            hbs`<FeedbackPanelV3 @disableChallengeActions={{this.disableChallengeActions}} @assessment={{this.assessment}}/>`,
          );

          // when
          await click(screen.getByRole('button', { name: 'Signaler un problème avec la question' }));

          // then
          assert.dom(screen.getByText('En attente du surveillant...')).exists();
          assert
            .dom(screen.getByText("Prévenez votre surveillant afin qu'il puisse constater votre problème."))
            .exists();
        });

        test('should display a refresh button', async function (assert) {
          const store = this.owner.lookup('service:store');
          const disableChallengeItemActions = sinon.stub();
          this.set('disableChallengeActions', disableChallengeItemActions);

          const mockAssessment = store.createRecord('assessment', {
            state: 'paused',
          });
          this.set('assessment', mockAssessment);

          const screen = await render(
            hbs`<FeedbackPanelV3 @disableChallengeActions={{this.disableChallengeActions}} @assessment={{this.assessment}}/>`,
          );

          // when
          await click(screen.getByRole('button', { name: 'Signaler un problème avec la question' }));

          // then
          assert.dom(screen.getByText('En attente du surveillant...')).exists();
          assert.dom(screen.getByText('Rafraîchir la page')).exists();
        });
      });
    });
  });
});
