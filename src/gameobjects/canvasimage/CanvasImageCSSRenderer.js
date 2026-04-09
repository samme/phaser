
const RenderFilters = require('../../renderer/css/RenderFilters');
const RenderTransformWithSize = require('../../renderer/css/RenderTransformWithSize');
const RenderMask = require('../../renderer/css/RenderMask');

/**
 * Renders this Game Object with the CSS Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.CanvasImage#renderCSS
 * @since 5.0.0
 * @private
 *
 * @param {Phaser.Renderer.CSS.CSSRenderer} renderer - The CSS renderer.
 * @param {Phaser.GameObjects.CanvasImage} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 */
const CanvasImageCSSRenderer = function (renderer, src, camera)
{
    const { renderNode } = src;

    if (!src.willRenderCSS())
    {
        renderNode.hide();

        return;
    }

    // For now addToRenderList() is required for pointer input.
    camera.addToRenderList(src);

    renderer.countDirtyState(src.dirty, 1);

    if (src.dirty)
    {
        const image = src.texture.getSourceImage();

        image.setAttribute('style', 'position: absolute; left: 0; top: 0');

        renderNode.element.appendChild(image);

        src.dirty = false;

        renderer.mutateCount++;
    }

    const { alpha, blendMode } = src;

    renderNode.show();
    renderNode.setAlpha(alpha);
    renderNode.setBlendMode(blendMode);

    RenderFilters(src);
    RenderMask(src);
    RenderTransformWithSize(src, camera);
};

module.exports = CanvasImageCSSRenderer;
