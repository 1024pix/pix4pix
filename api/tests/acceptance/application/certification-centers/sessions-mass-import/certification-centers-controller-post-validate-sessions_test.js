import {
  expect,
  databaseBuilder,
  generateValidRequestAuthorizationHeader,
  knex,
  sinon,
} from '../../../../test-helper.js';

import { createServer } from '../../../../../server.js';
import lodash from 'lodash';

const { omit } = lodash;

describe('Acceptance | Controller | certification-centers-controller-post-validate-sessions', function () {
  let server;

  beforeEach(async function () {
    server = await createServer();
  });

  afterEach(async function () {
    await knex('certification-cpf-cities').delete();
    await knex('certification-cpf-countries').delete();
    await knex('certification-candidates').delete();
    return knex('sessions').delete();
  });

  describe('POST /api/certification-centers/{certificationCenterId}/sessions/validate-for-mass-import', function () {
    let clock;

    beforeEach(async function () {
      clock = sinon.useFakeTimers({
        now: new Date('2023-01-01'),
        toFake: ['Date'],
      });
    });

    afterEach(async function () {
      clock.restore();
    });

    context('when user validate sessions for import', function () {
      it('should return status 200', async function () {
        // given
        const userId = databaseBuilder.factory.buildUser().id;
        const certificationCenterId = databaseBuilder.factory.buildCertificationCenter({
          type: 'SUP',
          externalId: '1234AB',
        }).id;
        databaseBuilder.factory.buildOrganization({ externalId: '1234AB', isManagingStudents: false, type: 'SUP' });

        databaseBuilder.factory.buildCertificationCenterMembership({ userId, certificationCenterId });
        await databaseBuilder.commit();

        const newBuffer = `Numéro de session préexistante;* Nom du site;* Nom de la salle;* Date de début (format: JJ/MM/AAAA);* Heure de début (heure locale format: HH:MM);* Surveillant(s);Observations (optionnel);* Nom de naissance;* Prénom;* Date de naissance (format: JJ/MM/AAAA);* Sexe (M ou F);Code INSEE de la commune de naissance;Code postal de la commune de naissance;Nom de la commune de naissance;* Pays de naissance;E-mail du destinataire des résultats (formateur, enseignant…);E-mail de convocation;Identifiant externe;Temps majoré ? (exemple format: 33%);* Tarification part Pix (Gratuite, Prépayée ou Payante);Code de prépaiement (si Tarification part Pix Prépayée)
        ;site1;salle1;19/10/2023;12:00;surveillant;non;;;;;;;;;;;;;;`;

        const options = {
          method: 'POST',
          url: `/api/certification-centers/${certificationCenterId}/sessions/validate-for-mass-import`,
          headers: {
            authorization: generateValidRequestAuthorizationHeader(userId),
          },
          payload: newBuffer,
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(_checkIfValidUUID(response.result.cachedValidatedSessionsKey)).to.be.true;
        expect(omit(response.result, 'cachedValidatedSessionsKey')).to.deep.equal({
          candidatesCount: 0,
          errorReports: [
            {
              code: 'EMPTY_SESSION',
              line: 2,
              isBlocking: false,
            },
          ],
          sessionsCount: 1,
          sessionsWithoutCandidatesCount: 1,
        });
      });
    });

    context('when user validate candidates on existing session with candidates', function () {
      context('when csv first line has sessionId and no session information', function () {
        context('when csv last line has sessionId and session information', function () {
          it('should throw and do nothing', async function () {
            // given
            const userId = databaseBuilder.factory.buildUser().id;
            const certificationCenterId = databaseBuilder.factory.buildCertificationCenter({
              externalId: '1234AB',
              type: 'SUP',
            }).id;
            databaseBuilder.factory.buildOrganization({ externalId: '1234AB', isManagingStudents: false, type: 'SUP' });
            databaseBuilder.factory.buildCertificationCpfCountry({
              commonName: 'FRANCE',
              matcher: 'ACEFNR',
              code: '99100',
            });
            databaseBuilder.factory.buildCertificationCpfCity({
              INSEECode: '75115',
              name: 'Paris',
              isActualName: true,
            });
            databaseBuilder.factory.buildCertificationCenterMembership({ userId, certificationCenterId });
            const sessionId = databaseBuilder.factory.buildSession({ id: 1234, certificationCenterId }).id;
            databaseBuilder.factory.buildCertificationCandidate({ sessionId, lastName: 'Toto' });
            databaseBuilder.factory.buildCertificationCandidate({ sessionId, lastName: 'Foo' });
            databaseBuilder.factory.buildCertificationCandidate({ sessionId, lastName: 'Bar' });
            await databaseBuilder.commit();

            const newBuffer = `Numéro de session préexistante;* Nom du site;* Nom de la salle;* Date de début (format: JJ/MM/AAAA);* Heure de début (heure locale format: HH:MM);* Surveillant(s);Observations (optionnel);* Nom de naissance;* Prénom;* Date de naissance (format: JJ/MM/AAAA);* Sexe (M ou F);Code INSEE de la commune de naissance;Code postal de la commune de naissance;Nom de la commune de naissance;* Pays de naissance;E-mail du destinataire des résultats (formateur, enseignant…);E-mail de convocation;Identifiant externe;Temps majoré ? (exemple format: 33%);* Tarification part Pix (Gratuite, Prépayée ou Payante);Code de prépaiement (si Tarification part Pix Prépayée)
          ${sessionId};;;;;;;Tutu;Jean-Paul;01/01/2000;M;75115;;;FRANCE;;;;;Gratuite;;
          ${sessionId};site1;salle1;19/10/2023;12:00;surveillant;non;Tata;Corinne;01/01/2000;M;75115;;;FRANCE;;;;;Gratuite;;`;

            const options = {
              method: 'POST',
              url: `/api/certification-centers/${certificationCenterId}/sessions/validate-for-mass-import`,
              headers: {
                authorization: generateValidRequestAuthorizationHeader(userId),
              },
              payload: newBuffer,
            };

            // when
            const response = await server.inject(options);

            // then
            expect(response.statusCode).to.equal(200);
            expect(response.result).to.deep.equal({
              cachedValidatedSessionsKey: undefined,
              sessionsCount: 2,
              sessionsWithoutCandidatesCount: 0,
              candidatesCount: 2,
              errorReports: [
                {
                  code: 'INFORMATION_NOT_ALLOWED_WITH_SESSION_ID',
                  line: 3,
                  isBlocking: true,
                },
              ],
            });
          });
        });
      });
    });
  });
});

function _checkIfValidUUID(str) {
  const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexExp.test(str);
}
