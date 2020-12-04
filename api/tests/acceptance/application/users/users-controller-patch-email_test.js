const { expect, databaseBuilder, generateValidRequestAuthorizationHeader } = require('../../../test-helper');
const createServer = require('../../../../server');

describe('Acceptance | Controller | users-controller', () => {

  let server;

  beforeEach(async () => {
    server = await createServer();
  });

  describe('PATCH /api/users/{id}/email', () => {

    context('user is valid', () => {

      let user;

      beforeEach(async () => {
        user = databaseBuilder.factory.buildUser({
          email: 'old_email@example.net',
        });

        await databaseBuilder.commit();
      });

      it('should return status 204 with user', async () => {
        // given
        const options = {
          method: 'PATCH',
          url: `/api/users/${user.id}/email`,
          headers: { authorization: generateValidRequestAuthorizationHeader(user.id) },
          payload: {
            data: {
              type: 'users',
              attributes: {
                'email': 'new_email@example.net',
              },
            },
          },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(204);
      });

      it('should return 403 if account is not his own', async () => {
        // given
        const options = {
          method: 'PATCH',
          url: `/api/users/${user.id}/email`,
          headers: { authorization: generateValidRequestAuthorizationHeader(user.id - 1) },
          payload: {
            data: {
              type: 'users',
              attributes: {
                'email': 'new_email@example.net',
              },
            },
          },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(403);
      });

      it('should return 403 if user has no email', async () => {
        // given
        const userWithoutEmail = databaseBuilder.factory.buildUser({ email: null });

        await databaseBuilder.commit();

        const options = {
          method: 'PATCH',
          url: `/api/users/${userWithoutEmail.id}/email`,
          headers: { authorization: generateValidRequestAuthorizationHeader(userWithoutEmail.id) },
          payload: {
            data: {
              type: 'users',
              attributes: {
                'email': 'new_email@example.net',
              },
            },
          },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(403);
      });

      it('should return 422 if email is invalid', async () => {
        // given
        const options = {
          method: 'PATCH',
          url: `/api/users/${user.id}/email`,
          headers: { authorization: generateValidRequestAuthorizationHeader(user.id - 1) },
          payload: {
            data: {
              type: 'users',
              attributes: {
                'email': 'not_an_email',
              },
            },
          },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(422);
      });

    });
  });
});
