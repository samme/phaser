var NOOP = require('../../utils/NOOP');
var renderWebGL = NOOP;
var renderCanvas = NOOP;
var renderCSS = require('./GradientCSSRenderer');

if (typeof WEBGL_RENDERER)
{
    renderWebGL = require('./ShaderWebGLRenderer');
}

if (typeof CANVAS_RENDERER)
{
    renderCanvas = require('./ShaderCanvasRenderer');
}

module.exports = {

    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas,
    renderCSS: renderCSS

};
