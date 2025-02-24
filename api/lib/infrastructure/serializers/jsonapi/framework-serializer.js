import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = function (frameworks) {
  return new Serializer('framework', {
    ref: 'id',
    attributes: ['name', 'areas', 'isCore'],
    areas: {
      ref: true,
      ignoreRelationshipData: true,
      relationshipLinks: {
        related: (framework) => `/api/admin/frameworks/${framework.id}/areas`,
      },
    },
    transform: (framework) => ({
      ...framework,
      areas: true, // forces areas relationship
    }),
  }).serialize(frameworks);
};

const serializeDeepWithoutSkills = function (frameworks) {
  return new Serializer('framework', {
    ref: 'id',
    attributes: ['name', 'areas'],
    areas: {
      include: true,
      ref: 'id',
      attributes: ['code', 'title', 'color', 'competences'],
      competences: {
        include: true,
        ref: 'id',
        attributes: ['name', 'index', 'thematics'],

        thematics: {
          include: true,
          ref: 'id',
          attributes: ['name', 'index', 'tubes'],

          tubes: {
            include: true,
            ref: 'id',
            attributes: ['name', 'practicalTitle', 'practicalDescription', 'isMobileCompliant', 'isTabletCompliant'],
          },
        },
      },
    },
  }).serialize(frameworks);
};

export { serialize, serializeDeepWithoutSkills };
