/**
 * Converts an RGB integer color value (`0xRRGGBB`) to a CSS hex string.
 *
 * @param {number} color - Integer color, 0 to 0xffffff.
 * @returns {string} CSS hex color string, e.g. '#ff0000'.
 */
const IntegerToCSSColor = function (color)
{
    return `#${ (color & 0xffffff).toString(16).padStart(6, '0')}`;
};

module.exports = IntegerToCSSColor;
