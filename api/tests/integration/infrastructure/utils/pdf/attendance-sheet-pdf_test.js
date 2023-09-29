import { domainBuilder, expect, sinon } from '../../../../test-helper.js';
import { isSameBinary } from '../../../../tooling/binary-comparator.js';
import { getAttendanceSheetPdfBuffer } from '../../../../../lib/infrastructure/utils/pdf/attendance-sheet-pdf.js';
import pdfLibUtils from 'pdf-lib/cjs/utils/index.js';
import * as url from 'url';
import { writeFile } from 'fs/promises';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

describe('Integration | Infrastructure | Utils | Pdf | Attendance sheet Pdf', function () {
  beforeEach(function () {
    _makePdfLibPredictable();
  });

  context('when there are less than 20 candidates', function () {
    it('should return full attendance sheet with 1 page as a buffer', async function () {
      // given
      const candidates = _createMultipleCandidate(19);
      const session = domainBuilder.buildSessionForAttendanceSheet({ certificationCandidates: candidates });
      const outputFilename = '/attendance-sheet-with-1-page_expected.pdf';

      // when
      const buffer = await getAttendanceSheetPdfBuffer({
        session,
        creationDate: new Date('2021-01-01'),
      });

      await _writeFile({ outputFilename, buffer });

      // then
      expect(await isSameBinary(`${__dirname}${outputFilename}`, buffer)).to.be.true;
    });
  });

  context('when there are more than 20 candidates', function () {
    it('should return full attendance sheet with 2 pages as a buffer', async function () {
      // given
      const candidates = _createMultipleCandidate(22);
      const session = domainBuilder.buildSessionForAttendanceSheet({ certificationCandidates: candidates });
      const outputFilename = '/attendance-sheet-with-2-pages_expected.pdf';

      // when
      const buffer = await getAttendanceSheetPdfBuffer({
        session,
        creationDate: new Date('2021-01-01'),
      });

      await _writeFile({ outputFilename, buffer });

      // then
      expect(await isSameBinary(`${__dirname}${outputFilename}`, buffer)).to.be.true;
    });
  });

  context('when the information are too long', function () {
    it('should return truncated information', async function () {
      // given
      const candidate = domainBuilder.buildCertificationCandidateForAttendanceSheet({
        lastName: 'JaiUnPrénomTrèsTrèsTrèsLong',
        firstName: 'JaiUnNomTrèsTrèsTrèsLongAussi',
        externalId: 'JaiUnExternalIdTrèsTrèsTrèsLong',
      });
      const session = domainBuilder.buildSessionForAttendanceSheet({
        address: '1024 boulevard des Capucines',
        room: 'Salle du fond au 1er étage, après les toilettes',
        examiner: 'Jean Michel, Brigitte, Jerôme, Claude',
        certificationCandidates: [candidate],
      });
      const outputFilename = '/attendance-sheet-with-truncated-information_expected.pdf';

      // when
      const buffer = await getAttendanceSheetPdfBuffer({
        session,
        creationDate: new Date('2021-01-01'),
      });

      await _writeFile({ outputFilename, buffer });

      // then
      expect(await isSameBinary(`${__dirname}${outputFilename}`, buffer)).to.be.true;
    });
  });
});

function _makePdfLibPredictable() {
  const suffixes = new Map();

  function autoIncrementSuffixByPrefix(prefix, suffixLength) {
    if (suffixLength === void 0) {
      suffixLength = 4;
    }

    const suffix = (suffixes.get(prefix) ?? Math.pow(10, suffixLength)) + 1;
    suffixes.set(prefix, suffix);

    return prefix + '-' + Math.floor(suffix);
  }

  sinon.stub(pdfLibUtils, 'addRandomSuffix').callsFake(autoIncrementSuffixByPrefix);
}

async function _writeFile({ buffer, outputFilename, dryRun = true }) {
  // Note: to update or create the reference pdf, set dryRun to false.
  if (!dryRun) {
    await writeFile(`${__dirname}/${outputFilename}`, buffer);
  }
}

function _createMultipleCandidate(candidateCount) {
  const candidates = [];
  for (let i = 0; i < candidateCount; i++) {
    candidates.push(
      domainBuilder.buildCertificationCandidateForAttendanceSheet({
        lastName: 'Potter',
        firstName: 'Harry',
      }),
    );
  }
  return candidates;
}
