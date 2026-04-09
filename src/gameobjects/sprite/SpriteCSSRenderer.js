const RenderFilters = require('../../renderer/css/RenderFilters');
const RenderFrameWithCrop = require('../../renderer/css/RenderFrameWithCrop');
const RenderMask = require('../../renderer/css/RenderMask');

/**
 * Renders this Game Object with the CSS Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Sprite#renderCSS
 * @since 5.0.0
 * @private
 *
 * @param {Phaser.Renderer.CSS.CSSRenderer} renderer - A reference to the current active CSS renderer.
 * @param {Phaser.GameObjects.Sprite} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 */
var SpriteCSSRenderer = function (renderer, src, camera)
{
    const { renderNode } = src;

    if (!src.willRenderCSS())
    {
        renderNode.hide();

        return;
    }

    camera.addToRenderList(src);

    renderNode.show();
    renderNode.setAlpha(src.alpha);
    renderNode.setBlendMode(src.blendMode);

    RenderFrameWithCrop(src, camera);
    RenderMask(src);
    RenderFilters(src);
};

module.exports = SpriteCSSRenderer;
