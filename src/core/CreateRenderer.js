/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const CanvasPool = require('../display/canvas/CanvasPool');
const CONST = require('../const');

/**
 * Called automatically by Phaser.Game and responsible for creating the renderer it will use.
 *
 * Inspects the game configuration to determine the appropriate render type (WebGL, Canvas, or Headless),
 * validates that the chosen renderer is supported by the current device, sets up the canvas element
 * (either adopting one provided in the game config or creating a new one from the CanvasPool), applies
 * any canvas CSS styles and pixel art interpolation settings, then instantiates and assigns the renderer
 * to `game.renderer`.
 *
 * Relies upon two webpack global flags, `WEBGL_RENDERER` and `CANVAS_RENDERER`, which are defined at
 * build time and inlined into the bundle as compile-time constants. They are not available as runtime
 * variables and determine which renderer classes are included in the build.
 *
 * @function Phaser.Core.CreateRenderer
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - The Phaser.Game instance on which the renderer will be set.
 */
var CreateRenderer = function (game)
{
    const config = game.config;

    if (config.renderType !== CONST.AUTO && config.renderType !== CONST.CSS)
    {
        // throw new Error('Use only renderer type AUTO or CSS. No other renderer types are available');

        console.warn('Forcing renderer type CSS');
    }

    config.renderType = CONST.CSS;

    const baseSize = game.scale.baseSize;
    const width = baseSize.width;
    const height = baseSize.height;

    if (config.canvas)
    {
        game.canvas = config.canvas;

        game.canvas.width = width;
        game.canvas.height = height;
    }
    else
    {
        game.canvas = CanvasPool.create(game, width, height, config.renderType);
    }

    if (config.canvasStyle)
    {
        game.canvas.style = config.canvasStyle;
    }

    var CSSRenderer = require('../renderer/css/CSSRenderer');

    game.renderer = new CSSRenderer(game);
};

module.exports = CreateRenderer;
