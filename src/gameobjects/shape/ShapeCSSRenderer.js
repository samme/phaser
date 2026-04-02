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
const ShapeCSSRenderer = function (renderer, shape)
{
    const renderNode = shape.renderNode;

    if (!shape.willRenderCSS())
    {
        renderNode.hide();
        return;
    }

    renderNode.show();

    renderNode.setAlpha(shape.alpha);
    renderNode.setBlendMode(shape.blendMode);

    const x = shape.x - shape.displayOriginX;
    const y = shape.y - shape.displayOriginY;

    if (shape.rotation === 0 && shape.scaleX === 1 && shape.scaleY === 1)
    {
        renderNode.setXY(x, y);
    }
    else
    {
        renderNode.setTransformOrigin(shape.displayOriginX, shape.displayOriginY);
        renderNode.setTSR(x, y, shape.scaleX, shape.scaleY, shape.rotation);
    }

    renderNode.setSize(shape.width, shape.height);

    // TODO: tint & filters

    UpdateSVGShape(shape, shape.element);
};

module.exports = ShapeCSSRenderer;
