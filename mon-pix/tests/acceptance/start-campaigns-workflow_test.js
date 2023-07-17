import { module, test } from 'qunit';

import { click, fillIn, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { Response } from 'miragejs';

import { authenticate, authenticateByGAR } from '../helpers/authentication';
import { startCampaignByCode, startCampaignByCodeAndExternalId } from '../helpers/campaign';
import { currentSession } from 'ember-simple-auth/test-support';
import ENV from 'mon-pix/config/environment';
import setupIntl from '../helpers/setup-intl';
import { t } from 'ember-intl/test-support';
import { visit } from '@1024pix/ember-testing-library';

const AUTHENTICATED_SOURCE_FROM_GAR = ENV.APP.AUTHENTICATED_SOURCE_FROM_GAR;

module('Acceptance | Campaigns | Start Campaigns workflow', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  let campaign;

  hooks.beforeEach(function () {
    this.server.schema.users.create({
      mustValidateTermsOfService: true,
    });
  });

  module('Start a campaign', function (hooks) {
    let prescritUser;

    hooks.beforeEach(function () {
      prescritUser = server.create('user', 'withEmail', {
        mustValidateTermsOfService: false,
        lastTermsOfServiceValidatedAt: null,
      });
    });

    module('When user is not logged in', function () {
      module('When user has not given any campaign code', function () {
        test('should access campaign form page', async function (assert) {
          // when
          const screen = await visit('/campagnes');

          // then
          assert.dom(screen.getByRole('button', { name: 'Accéder au parcours' })).exists();
        });
      });

      module('When campaign code exists', function () {
        module('When campaign is not restricted', function () {
          test('should display landing page', async function (assert) {
            // given
            const campaign = server.create('campaign', { isRestricted: false });
            const screen = await visit('/campagnes');

            // when
            await fillIn(screen.getByRole('textbox', { name: t('pages.fill-in-campaign-code.label') }), campaign.code);
            await click(screen.getByRole('button', { name: 'Accéder au parcours' }));

            // then
            assert.strictEqual(currentURL(), `/campagnes/${campaign.code}/presentation`);
          });
        });

        module('When is a simplified access campaign', function (hooks) {
          hooks.beforeEach(function () {
            campaign = server.create('campaign', { isSimplifiedAccess: true, idPixLabel: 'Les anonymes' });
          });

          test('should redirect to landing page', async function (assert) {
            // when
            await visit(`/campagnes/${campaign.code}`);

            // then
            assert.strictEqual(currentURL(), `/campagnes/${campaign.code}/presentation`);
          });

          test('should redirect to tutorial page after starting campaign', async function (assert) {
            // when
            const screen = await visit(`/campagnes/${campaign.code}`);
            await click(screen.getByRole('button', { name: 'Je commence' }));
            await fillIn(screen.getByRole('textbox', { name: 'Les anonymes' }), 'vu');
            await click(screen.getByRole('button', { name: 'Continuer' }));

            // then
            assert.strictEqual(currentURL(), `/campagnes/${campaign.code}/evaluation/didacticiel`);
          });
        });
      });

      module('When campaign code does not exist', function () {
        test('should display an error message on fill-in-campaign-code page', async function (assert) {
          // given
          const campaignCode = 'NONEXIST';
          const screen = await visit('/campagnes');

          // when
          await fillIn(screen.getByRole('textbox', { name: t('pages.fill-in-campaign-code.label') }), campaignCode);
          await click(screen.getByRole('button', { name: 'Accéder au parcours' }));

          // then
          assert.strictEqual(currentURL(), '/campagnes');
          assert.dom(screen.getByText(t('pages.fill-in-campaign-code.errors.not-found'))).exists();
        });
      });

      module('When user validates with empty campaign code', function () {
        test('should display an error', async function (assert) {
          // given
          const screen = await visit('/campagnes');

          // when
          await click(screen.getByRole('button', { name: 'Accéder au parcours' }));

          // then
          assert.strictEqual(currentURL(), '/campagnes');
          assert.dom(screen.getByText('Veuillez saisir un code.')).exists();
        });
      });

      module('When the user has already seen the landing page', function () {
        test('should redirect to signin page', async function (assert) {
          // given & when
          const campaign = server.create('campaign');
          await startCampaignByCode(campaign.code);

          // then
          assert.strictEqual(currentURL(), '/connexion');
        });
      });

      module('When the user has not seen the landing page', function () {
        test('should redirect to landing page', async function (assert) {
          // when
          const campaign = server.create('campaign');
          await visit(`/campagnes/${campaign.code}`);

          // then
          assert.strictEqual(currentURL(), `/campagnes/${campaign.code}/presentation`);
        });

        module('When campaign has custom text for the landing page', function () {
          test('should show the custom text on the landing page', async function (assert) {
            // given
            const campaign = server.create('campaign', { customLandingPageText: 'SomeText' });

            // when
            const screen = await visit(`/campagnes/${campaign.code}`);

            // then
            assert.dom(screen.getByText('SomeText')).exists();
          });
        });
      });
    });

    module('When user is logged in', function (hooks) {
      hooks.beforeEach(async function () {
        await authenticate(prescritUser);
      });

      module('When campaign is not restricted', function () {
        test('should redirect to landing page', async function (assert) {
          // given
          campaign = server.create('campaign');

          // when
          await visit(`/campagnes/${campaign.code}`);

          //then
          assert.strictEqual(currentURL(), `/campagnes/${campaign.code}/presentation`);
        });
      });

      module('When campaign is restricted and SCO', function (hooks) {
        hooks.beforeEach(function () {
          campaign = server.create('campaign', { isRestricted: true, organizationType: 'SCO' });
        });

        module('When association is not already done', function () {
          test('should redirect to landing page', async function (assert) {
            // given
            const screen = await visit('/campagnes');

            //when
            await fillIn(screen.getByRole('textbox', { name: t('pages.fill-in-campaign-code.label') }), campaign.code);
            await click(screen.getByRole('button', { name: 'Accéder au parcours' }));

            //then
            assert.strictEqual(currentURL(), `/campagnes/${campaign.code}/presentation`);
          });

          test('should try to reconcile automatically before redirect to invited sco student page', async function (assert) {
            // given
            server.get('sco-organization-learners', () => {
              return { data: null };
            });
            server.create('sco-organization-learner', {
              campaignCode: campaign.code,
            });

            // when
            const screen = await visit(`/campagnes/${campaign.code}`);
            await click(screen.getByRole('button', { name: 'Je commence' }));

            // then
            assert.strictEqual(currentURL(), `/campagnes/${campaign.code}/evaluation/didacticiel`);
          });

          test('should redirect to invited sco student page when landing page has been seen', async function (assert) {
            // given
            const screen = await visit(`/campagnes/${campaign.code}`);

            //when
            await click(screen.getByRole('button', { name: 'Je commence' }));

            //then
            assert.strictEqual(currentURL(), `/campagnes/${campaign.code}/prescrit/eleve`);
          });

          test('should not set any field by default', async function (assert) {
            // when
            const screen = await visit(`/campagnes/${campaign.code}`);
            await click(screen.getByRole('button', { name: 'Je commence' }));

            //then
            assert.strictEqual(screen.getByRole('textbox', { name: 'Prénom' }).value, '');
            assert.strictEqual(screen.getByRole('textbox', { name: 'Nom' }).value, '');
          });

          test('should begin campaign participation when fields are filled in and associate button is clicked', async function (assert) {
            // given
            const screen = await visit(`/campagnes/${campaign.code}`);
            await click(screen.getByRole('button', { name: 'Je commence' }));
            await fillIn(screen.getByRole('textbox', { name: 'Prénom' }), 'Robert');
            await fillIn(screen.getByRole('textbox', { name: 'Nom' }), 'Smith');
            await fillIn(screen.getByRole('textbox', { name: 'jour de naissance' }), '10');
            await fillIn(screen.getByRole('textbox', { name: 'mois de naissance' }), '12');
            await fillIn(screen.getByRole('textbox', { name: 'année de naissance' }), '2000');

            // when
            await click(screen.getByRole('button', { name: "C'est parti !" }));
            await click(screen.getByRole('button', { name: 'Associer' }));

            //then
            assert.strictEqual(currentURL(), `/campagnes/${campaign.code}/evaluation/didacticiel`);
          });
        });

        module('When association is already done', function (hooks) {
          hooks.beforeEach(function () {
            server.create('sco-organization-learner', {
              campaignCode: campaign.code,
            });
          });

          test('should redirect to landing page', async function (assert) {
            // when
            await visit(`/campagnes/${campaign.code}`);

            //then
            assert.strictEqual(currentURL(), `/campagnes/${campaign.code}/presentation`);
          });

          test('should begin campaign participation when landing page has been seen', async function (assert) {
            // given
            const screen = await visit(`/campagnes/${campaign.code}`);

            // when
            await click(screen.getByRole('button', { name: 'Je commence' }));

            //then
            assert.strictEqual(currentURL(), `/campagnes/${campaign.code}/evaluation/didacticiel`);
          });
        });
      });

      module('When campaign is restricted and SUP', function (hooks) {
        hooks.beforeEach(function () {
          campaign = server.create('campaign', { isRestricted: true, organizationType: 'SUP' });
        });

        test('should redirect to landing page', async function (assert) {
          // given
          const screen = await visit('/campagnes');

          //when
          await fillIn(screen.getByRole('textbox', { name: t('pages.fill-in-campaign-code.label') }), campaign.code);
          await click(screen.getByRole('button', { name: 'Accéder au parcours' }));

          //then
          assert.strictEqual(currentURL(), `/campagnes/${campaign.code}/presentation`);
        });

        test('should redirect to invited sup student page when landing page has been seen', async function (assert) {
          // given
          const screen = await visit(`/campagnes/${campaign.code}`);

          // when
          await click(screen.getByRole('button', { name: 'Je commence' }));

          // then
          assert.strictEqual(currentURL(), `/campagnes/${campaign.code}/prescrit/etudiant`);
        });

        test('should begin campaign participation when association is done', async function (assert) {
          // given
          const screen = await visit(`/campagnes/${campaign.code}`);
          await click(screen.getByRole('button', { name: 'Je commence' }));

          // when
          await fillIn(screen.getByRole('textbox', { name: 'Numéro étudiant' }), 'F100');
          await fillIn(screen.getByRole('textbox', { name: 'Prénom' }), 'Jean');
          await fillIn(screen.getByRole('textbox', { name: 'Nom' }), 'Bon');
          await fillIn(screen.getByRole('textbox', { name: 'jour de naissance' }), '01');
          await fillIn(screen.getByRole('textbox', { name: 'mois de naissance' }), '01');
          await fillIn(screen.getByRole('textbox', { name: 'année de naissance' }), '2000');
          await click(screen.getByRole('button', { name: "C'est parti !" }));

          // then
          assert.strictEqual(currentURL(), `/campagnes/${campaign.code}/evaluation/didacticiel`);
        });
      });

      module('When campaign has external id', function () {
        module('When participant external id is not set in the url', function () {
          test('should show the identifiant page after clicking on start button in landing page', async function (assert) {
            // given & when
            campaign = server.create('campaign', { idPixLabel: 'nom de naissance de maman' });
            await startCampaignByCode(campaign.code);

            // then
            assert.strictEqual(currentURL(), `/campagnes/${campaign.code}/prescrit/identifiant`);
          });
        });

        module('When participant external id is set in the url', function () {
          test('should begin campaign participation', async function (assert) {
            // given & when
            campaign = server.create('campaign', { idPixLabel: 'nom de naissance de maman' });
            await startCampaignByCodeAndExternalId(campaign.code);

            // then
            assert.strictEqual(currentURL(), `/campagnes/${campaign.code}/evaluation/didacticiel`);
          });
        });
      });

      module('When campaign does not have external id', function () {
        test('should begin campaign participation', async function (assert) {
          // given & when
          campaign = server.create('campaign', { idPixLabel: null });
          await startCampaignByCode(campaign.code);

          // then
          assert.strictEqual(currentURL(), `/campagnes/${campaign.code}/evaluation/didacticiel`);
        });
      });

      module('When campaign does not have external id but a participant external id is set in the url', function () {
        test('should begin campaign participation', async function (assert) {
          // given & when
          campaign = server.create('campaign', { idPixLabel: null });
          await startCampaignByCodeAndExternalId(campaign.code);

          // then
          assert.strictEqual(currentURL(), `/campagnes/${campaign.code}/evaluation/didacticiel`);
        });
      });

      module('When the campaign is restricted and organization learner is disabled', function (hooks) {
        hooks.beforeEach(function () {
          campaign = server.create('campaign', { code: 'FORBIDDEN', isRestricted: true });
        });

        test('should redirect to landing page', async function (assert) {
          // when
          await visit(`/campagnes/${campaign.code}`);

          // then
          assert.strictEqual(currentURL(), `/campagnes/${campaign.code}/presentation`);
        });

        test('should show an error message when user starts the campaign', async function (assert) {
          // when
          const screen = await visit(`/campagnes/${campaign.code}`);
          await click(screen.getByRole('button', { name: 'Je commence' }));

          // then
          assert.ok(screen.getByText('Oups, la page demandée n’est pas accessible.'));
        });
      });

      module('When campaign does not exist', function () {
        test('should show an error message', async function (assert) {
          // given & when
          const screen = await visit('/campagnes/codefaux');

          // then
          assert.strictEqual(currentURL(), '/campagnes/codefaux');
          assert.dom(screen.getByRole('heading', { name: 'Oups, la page demandée n’est pas accessible.' })).exists();
        });
      });

      module('When is a simplified access campaign', function (hooks) {
        hooks.beforeEach(function () {
          campaign = server.create('campaign', { isSimplifiedAccess: true, idPixLabel: 'Les anonymes' });
        });

        test('should redirect to landing page', async function (assert) {
          // when
          await visit(`/campagnes/${campaign.code}`);

          // then
          assert.strictEqual(currentURL(), `/campagnes/${campaign.code}/presentation`);
        });

        test('should redirect to tutorial page after starting campaign', async function (assert) {
          // when
          const screen = await visit(`/campagnes/${campaign.code}`);
          await click(screen.getByRole('button', { name: 'Je commence' }));
          await fillIn(screen.getByRole('textbox', { name: 'Les anonymes' }), 'vu');
          await click(screen.getByRole('button', { name: 'Continuer' }));

          // then
          assert.strictEqual(currentURL(), `/campagnes/${campaign.code}/evaluation/didacticiel`);
        });
      });
    });

    module('When user is logged as anonymous and campaign is simplified access', function () {
      test('should replace previous connected anonymous user', async function (assert) {
        // given
        campaign = server.create('campaign', { isSimplifiedAccess: true, idPixLabel: 'Les anonymes' });
        await currentSession().authenticate('authenticator:anonymous', { campaignCode: campaign.code });
        const session = currentSession();
        const previousUserId = session.data.authenticated['user_id'];

        // when
        const screen = await visit('/campagnes');
        await fillIn(screen.getByRole('textbox', { name: t('pages.fill-in-campaign-code.label') }), campaign.code);
        await click(screen.getByRole('button', { name: 'Accéder au parcours' }));
        await click(screen.getByRole('button', { name: 'Je commence' }));

        const currentUserId = session.data.authenticated['user_id'];

        // then
        assert.true(Number.isFinite(currentUserId));
        assert.notEqual(previousUserId, currentUserId);
      });
    });

    module('When user is logged in an external platform', function () {
      module('When campaign is restricted and SCO', function (hooks) {
        hooks.beforeEach(function () {
          campaign = server.create('campaign', { isRestricted: true, organizationType: 'SCO' });
        });

        module('When association is not already done and reconciliation token is provided', function () {
          test('should redirect to landing page', async function (assert) {
            // given
            const externalUserToken =
              'aaa.' +
              btoa(
                '{"first_name":"JeanPrescrit","last_name":"Campagne","saml_id":"SamlId","source":"external","iat":1545321469,"exp":4702193958}'
              ) +
              '.bbb';
            const screen = await visit(`/campagnes?externalUser=${externalUserToken}`);

            // when
            await fillIn(screen.getByRole('textbox', { name: t('pages.fill-in-campaign-code.label') }), campaign.code);
            await click(screen.getByRole('button', { name: 'Accéder au parcours' }));

            // then
            assert.strictEqual(currentURL(), `/campagnes/${campaign.code}/presentation`);
          });

          test('should redirect to reconciliation form when landing page has been seen', async function (assert) {
            // given
            const externalUserToken =
              'aaa.' +
              btoa(
                '{"first_name":"JeanPrescrit","last_name":"Campagne","saml_id":"SamlId","source":"external","iat":1545321469,"exp":4702193958}'
              ) +
              '.bbb';
            const screen = await visit(`/campagnes?externalUser=${externalUserToken}`);

            // when
            await fillIn(screen.getByRole('textbox', { name: t('pages.fill-in-campaign-code.label') }), campaign.code);
            await click(screen.getByRole('button', { name: 'Accéder au parcours' }));
            await click(screen.getByRole('button', { name: 'Je commence' }));

            // then
            assert.strictEqual(currentURL(), `/campagnes/${campaign.code}/rejoindre/mediacentre`);
          });

          test('should set by default firstName and lastName', async function (assert) {
            // given
            const externalUserToken =
              'aaa.' +
              btoa(
                '{"first_name":"JeanPrescrit","last_name":"Campagne","saml_id":"SamlId","source":"external","iat":1545321469,"exp":4702193958}'
              ) +
              '.bbb';
            const screen = await visit(`/campagnes?externalUser=${externalUserToken}`);

            // when
            await fillIn(screen.getByRole('textbox', { name: t('pages.fill-in-campaign-code.label') }), campaign.code);
            await click(screen.getByRole('button', { name: 'Accéder au parcours' }));
            await click(screen.getByRole('button', { name: 'Je commence' }));

            //then
            assert.strictEqual(screen.getByRole('textbox', { name: 'Prénom' }).value, 'JeanPrescrit');
            assert.strictEqual(screen.getByRole('textbox', { name: 'Nom' }).value, 'Campagne');
          });

          test('should begin campaign participation when reconciliation is done', async function (assert) {
            // given
            const externalUserToken =
              'aaa.' +
              btoa(
                '{"first_name":"JeanPrescrit","last_name":"Campagne","saml_id":"SamlId","source":"external","iat":1545321469,"exp":4702193958}'
              ) +
              '.bbb';
            const screen = await visit(`/campagnes?externalUser=${externalUserToken}`);

            // given
            await fillIn(screen.getByRole('textbox', { name: t('pages.fill-in-campaign-code.label') }), campaign.code);
            await click(screen.getByRole('button', { name: 'Accéder au parcours' }));
            await click(screen.getByRole('button', { name: 'Je commence' }));

            // when
            await fillIn(screen.getByRole('textbox', { name: 'jour de naissance' }), '10');
            await fillIn(screen.getByRole('textbox', { name: 'mois de naissance' }), '12');
            await fillIn(screen.getByRole('textbox', { name: 'année de naissance' }), '2000');
            await click(screen.getByRole('button', { name: "C'est parti !" }));

            //then
            assert.strictEqual(currentURL(), `/campagnes/${campaign.code}/evaluation/didacticiel`);
          });
        });

        module('When association is already done and user is created', function (hooks) {
          let garUser;

          hooks.beforeEach(async function () {
            garUser = server.create('user', AUTHENTICATED_SOURCE_FROM_GAR);
            await authenticateByGAR(garUser);
            server.create('sco-organization-learner', {
              campaignCode: campaign.code,
            });
          });

          test('should redirect to landing page', async function (assert) {
            // when
            await visit(`/campagnes/${campaign.code}`);

            //then
            assert.strictEqual(currentURL(), `/campagnes/${campaign.code}/presentation`);
          });

          module('When user is already reconciled in another organization', function () {
            test('should reconcile and redirect to landing-page', async function (assert) {
              // given
              server.get('sco-organization-learners', () => {
                return { data: null };
              });
              server.create('sco-organization-learner', {
                campaignCode: campaign.code,
              });
              const screen = await visit('/campagnes');

              // when
              await fillIn(
                screen.getByRole('textbox', { name: t('pages.fill-in-campaign-code.label') }),
                campaign.code
              );
              await click(screen.getByRole('button', { name: 'Accéder au parcours' }));

              // then
              assert.strictEqual(currentURL(), `/campagnes/${campaign.code}/presentation`);
            });
          });
        });

        module('When user is already reconciled and has no GAR authentication method yet', function (hooks) {
          hooks.beforeEach(async function () {
            server.post('/sco-organization-learners/external', async function () {
              return new Response(
                409,
                {},
                {
                  errors: [
                    {
                      status: '409',
                      code: 'ACCOUNT_WITH_EMAIL_ALREADY_EXIST_FOR_THE_SAME_ORGANIZATION',
                      title: 'Conflict',
                      detail: "Un compte existe déjà pour l'élève dans le même établissement.",
                      meta: {
                        shortCode: 'R31',
                        value: 'u***@example.net',
                        userId: 1,
                      },
                    },
                  ],
                }
              );
            });
          });
        });
      });
    });
  });
});
