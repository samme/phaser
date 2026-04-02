
const BlendModes = require('../BlendModes');

const CSSBlendModes = {
    [BlendModes.SKIP_CHECK]: 'normal',
    [BlendModes.NORMAL]: 'normal',
    [BlendModes.ADD]: 'plus-lighter',
    [BlendModes.MULTIPLY]: 'multiply',
    [BlendModes.SCREEN]: 'screen',
    [BlendModes.OVERLAY]: 'overlay',
    [BlendModes.DARKEN]: 'darken',
    [BlendModes.LIGHTEN]: 'lighten',
    [BlendModes.COLOR_DODGE]: 'color-dodge',
    [BlendModes.COLOR_BURN]: 'color-burn',
    [BlendModes.HARD_LIGHT]: 'hard-light',
    [BlendModes.SOFT_LIGHT]: 'soft-light',
    [BlendModes.DIFFERENCE]: 'difference',
    [BlendModes.EXCLUSION]: 'exclusion',
    [BlendModes.HUE]: 'hue',
    [BlendModes.SATURATION]: 'saturation',
    [BlendModes.COLOR]: 'color',
    [BlendModes.LUMINOSITY]: 'luminosity',
    [BlendModes.ERASE]: 'destination-out',
    [BlendModes.SOURCE_IN]: 'source-in',
    [BlendModes.SOURCE_OUT]: 'source-out',
    [BlendModes.SOURCE_ATOP]: 'source-atop',
    [BlendModes.DESTINATION_OVER]: 'destination-over',
    [BlendModes.DESTINATION_IN]: 'destination-in',
    [BlendModes.DESTINATION_OUT]: 'destination-out',
    [BlendModes.DESTINATION_ATOP]: 'destination-atop',
    [BlendModes.LIGHTER]: 'lighter',
    [BlendModes.COPY]: 'copy',
    [BlendModes.XOR]: 'xor'
};

module.exports = CSSBlendModes;
