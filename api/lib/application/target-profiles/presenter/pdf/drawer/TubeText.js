const Text = require('./Text');
const ColorManager = require('../manager/color-manager');
const FontManager = require('../manager/font-manager');
const PositionManager = require('../manager/position-manager');

module.exports = class TubeText extends Text {
  constructor({ practicalTitle, practicalDescription, positionY }) {
    super({
      text: practicalTitle || 'error on practicalTitle',
      positionX: PositionManager.tubeFirstPartStart,
      positionY,
      fontSize: FontManager.tubeHeight,
      font: FontManager.tubeFont,
      fontColor: ColorManager.findRGBColorByAreaColor('black'),
      maxWidth: PositionManager.tubeFirstPartWidth,
    });
    this.text2 = practicalDescription || 'error on practicalDescription';
  }

  draw(page, dryRun) {
    if (!dryRun) {
      super.draw(page, dryRun);
      page.drawText(this.text2, {
        x: PositionManager.tubeSecondPartStart,
        y: this.position.y,
        size: this.fontSize,
        font: this.font,
        color: this.fontColor,
        maxWidth: PositionManager.tubeSecondPartWidth,
        lineHeight: this.font.heightAtSize(this.fontSize),
      });
    }
    const nextPositionYText = this.nextPositionY(
      this.text,
      this.font,
      this.fontSize,
      page,
      this.position.y,
      PositionManager.tubeFirstPartWidth
    );
    const nextPositionYText2 = this.nextPositionY(
      this.text2,
      this.font,
      this.fontSize,
      page,
      this.position.y,
      PositionManager.tubeSecondPartWidth
    );
    return Math.min(nextPositionYText, nextPositionYText2);
  }
};
