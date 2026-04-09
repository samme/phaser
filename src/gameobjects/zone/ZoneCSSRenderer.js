const RenderTransformWithSize = require('../../renderer/css/RenderTransformWithSize');

/**
 * Renders this Game Object with the CSS Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Zone#renderCSS
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.CSS.CSSRenderer} renderer - The CSS renderer.
 * @param {Phaser.GameObjects.Zone} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 */
var ZoneCSSRenderer = function (renderer, src, camera)
{
    camera.addToRenderList(src);

    RenderTransformWithSize(src, camera);
};

module.exports = ZoneCSSRenderer;
