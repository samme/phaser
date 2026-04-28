var RenderFilters = require('../../renderer/css/RenderFilters');
var RenderMask = require('../../renderer/css/RenderMask');
var RenderTransform = require('../../renderer/css/RenderTransform');
var RenderTransformWithSize = require('../../renderer/css/RenderTransformWithSize');

/**
 * Renders this Game Object with the CSS Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Text#renderCSS
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.Canvas.CSSRenderer} renderer - The CSS renderer.
 * @param {Phaser.GameObjects.Text} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 */
var TextCSSRenderer = function (renderer, src, camera)
{
    const { renderNode } = src;

    if (!src.willRenderCSS())
    {
        renderNode.hide();

        return;
    }

    camera.addToRenderList(src);

    renderNode.show();

    const { dirty, padding, text } = src;

    renderNode.setAlpha(src.alpha);
    renderNode.setBlendMode(src.blendMode);

    RenderFilters(src);
    RenderMask(src);

    if (src.hasFixedSize())
    {
        RenderTransformWithSize(src, camera);
    }
    else
    {
        RenderTransform(src, camera);

        // Clear the cached dimensions so RenderTransformWithSize() can force an update later.
        renderNode._width = null;
        renderNode._height = null;
        renderNode.setProperty('width', 'max-content');
        renderNode.setProperty('height', 'auto');
    }

    if (dirty)
    {
        // Contents
        renderNode.element.innerText = text;

        // Padding
        renderNode.setProperty('padding', `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`);

        // Style
        const {
            align,
            backgroundColor,
            color,
            shadowBlur,
            shadowColor,
            shadowOffsetX,
            shadowOffsetY,
            _font
        } = src.style;

        renderNode.setProperty('backgroundColor', backgroundColor);
        renderNode.setProperty('color', color);
        renderNode.setProperty('font', _font);
        renderNode.setProperty('textAlign', align);
        renderNode.setProperty('textShadow', `${shadowColor} ${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px`);

        // Clean!
        src.dirty = false;
    }








};

module.exports = TextCSSRenderer;
