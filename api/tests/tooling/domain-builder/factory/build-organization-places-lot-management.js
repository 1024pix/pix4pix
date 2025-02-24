import { OrganizationPlacesLotManagement } from '../../../../lib/domain/read-models/OrganizationPlacesLotManagement.js';

function buildOrganizationPlacesLotManagement({
  id,
  count,
  organizationId,
  activationDate,
  expirationDate,
  reference,
  category,
  creatorLastName,
  creatorFirstName,
  createdAt,
} = {}) {
  return new OrganizationPlacesLotManagement({
    id,
    count,
    organizationId,
    activationDate,
    expirationDate,
    reference,
    category,
    creatorLastName,
    creatorFirstName,
    createdAt,
  });
}

export { buildOrganizationPlacesLotManagement };
