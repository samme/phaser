

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

    const { text, x, y, scaleX, scaleY, rotation, originX, originY, scrollFactorX, scrollFactorY, padding, dirty } = src;
    const sx = (1 - scrollFactorX) * scrollX;
    const sy = (1 - scrollFactorY) * scrollY;

    renderNode.setProperty('transform', `translate(${-100 * originX}%, ${-100 * originY}%) translate(${x + sx}px, ${y + sy}px) scale(${scaleX}, ${scaleY}) rotate(${rotation}rad)`);

    if (dirty)
    {
        // Contents
        renderNode.element.innerText = text;

        // Padding
        renderNode.setProperty('padding', `${padding.left}px ${padding.top}px ${padding.right}px ${padding.bottom}px`);

        // Style
        const {
            align,
            backgroundColor,
            color,
            fixedHeight,
            fixedWidth,
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
        renderNode.setProperty('width', fixedWidth > 0 ? `${fixedWidth}px` : 'max-content');
        renderNode.setProperty('height', fixedHeight > 0 ? `${fixedHeight}px` : 'auto');

        // Clean!
        src.dirty = false;
    }








};

module.exports = TextCSSRenderer;
