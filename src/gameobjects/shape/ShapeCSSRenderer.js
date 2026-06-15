const RenderFilters = require('../../renderer/css/RenderFilters');
const RenderMask = require('../../renderer/css/RenderMask');
const RenderTransformWithSize = require('../../renderer/css/RenderTransformWithSize');

const UpdateSVGShape = require('../../renderer/css/UpdateSVGShape');

/**
 * Renders this Game Object with the CSS Renderer.
 *
 * @method Phaser.GameObjects.Shape#renderCSS
 * @since 5.0.0
 * @private
 *
 * @param {Phaser.Renderer.CSS.CSSRenderer} renderer - A reference to the current active CSS Renderer.
 * @param {Phaser.GameObjects.Shape} shape - The Game Object being rendered in this call.
 */
const ShapeCSSRenderer = function (renderer, shape, camera)
{
    const renderNode = shape.renderNode;

    if (!shape.willRenderCSS())
    {
        renderNode.hide();
        return;
    }

    camera.addToRenderList(shape);

    renderNode.show();
    renderNode.setAlpha(shape.alpha);
    renderNode.setBlendMode(shape.blendMode);

    RenderFilters(shape);
    RenderMask(shape);
    RenderTransformWithSize(shape, camera);

    if (shape.dirty)
    {
        UpdateSVGShape(shape, shape.element);

        shape.dirty = false;
    }
};

module.exports = ShapeCSSRenderer;
