const TintModes = require('../../renderer/TintModes');

const CSSTintModes = {
    [TintModes.MULTIPLY]: 'multiply',
    [TintModes.FILL]: 'normal',
    [TintModes.ADD]: 'screen',
    [TintModes.SCREEN]: 'screen',
    [TintModes.OVERLAY]: 'overlay',
    [TintModes.HARD_LIGHT]: 'hard-light'
};

module.exports = CSSTintModes;
