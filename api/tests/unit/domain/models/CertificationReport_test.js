const { expect, EMPTY_BLANK_AND_NULL } = require('../../../test-helper');
const CertificationReport = require('../../../../lib/domain/models/CertificationReport');

describe('Unit | Domain | Models | CertificationReport', function() {

  describe('#constructor', function() {
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    EMPTY_BLANK_AND_NULL.forEach((examinerComment) => {
      it(`should return no examiner comment if comment is "${examinerComment}"`, function() {
        // when
        const certificationReport = new CertificationReport({ examinerComment });

        // then
        expect(certificationReport.examinerComment).to.equal(CertificationReport.NO_EXAMINER_COMMENT);
      });
    });
  });
});
