import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = function (authentications) {
  return new Serializer('authentication', {
    attributes: ['token', 'user_id', 'password'],
    transform(model) {
      const authentication = Object.assign({}, model.toJSON());
      authentication.user_id = model.userId.toString();
      authentication.id = model.userId;
      authentication.password = '';
      return authentication;
    },
  }).serialize(authentications);
};

export { serialize };
