const { expect, databaseBuilder, generateValidRequestAuthorizationHeader, sinon } = require('../../../test-helper');
const createServer = require('../../../../server');
const { featureToggles } = require('../../../../lib/config');

describe('Acceptance | Controller | session-for-supervising-controller-get', function () {
  let server;

  beforeEach(async function () {
    server = await createServer();
  });

  context('when FT_IS_END_TEST_SCREEN_REMOVAL_ENABLED is enabled', function () {
    it('should return OK and a sessionForSupervisings type', async function () {
      // given
      sinon.stub(featureToggles, 'isEndTestScreenRemovalEnabled').value(true);
      databaseBuilder.factory.buildCertificationCenter({ id: 345 });
      databaseBuilder.factory.buildSession({ id: 121, certificationCenterId: 345 });
      databaseBuilder.factory.buildCertificationCandidate({ sessionId: 121 });
      await databaseBuilder.commit();

      const userId = databaseBuilder.factory.buildUser().id;
      const headers = { authorization: generateValidRequestAuthorizationHeader(userId, 'pix-certif') };

      const options = {
        headers,
        method: 'GET',
        url: '/api/sessions/121/supervising',
        payload: {},
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result.data.type).to.equal('sessionForSupervising');
    });
  });

  context('when FT_IS_END_TEST_SCREEN_REMOVAL_ENABLED is not enabled', function () {
    it('should return 404 HTTP status code ', async function () {
      const options = {
        method: 'GET',
        url: '/api/sessions/121/supervising',
        payload: {},
      };
      options.headers = { authorization: generateValidRequestAuthorizationHeader(1111) };
      sinon.stub(featureToggles, 'isEndTestScreenRemovalEnabled').value(false);

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(404);
    });
  });
});
