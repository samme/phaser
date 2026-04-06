var NOOP = require('../../utils/NOOP');
var renderCSS = require('./CanvasImageCSSRenderer');

module.exports = {

    renderWebGL: NOOP,
    renderCanvas: NOOP,
    renderCSS: renderCSS

};
