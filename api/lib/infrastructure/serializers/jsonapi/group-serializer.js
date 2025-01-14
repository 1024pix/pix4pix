import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = function (groups) {
  return new Serializer('groups', {
    id: 'name',
    attributes: ['name'],
  }).serialize(groups);
};

export { serialize };
