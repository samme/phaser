/**
 * Renders this Game Object with the CSS Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Container#renderCSS
 * @since 3.4.0
 * @private
 *
 * @param {Phaser.Renderer.CSS.CSSRenderer} renderer - A reference to the current active CSS renderer.
 * @param {Phaser.GameObjects.Container} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 */
var ContainerCSSRenderer = function (renderer, src, camera)
{
    const { dirty, renderNode } = src;

    if (!src.willRenderCSS())
    {
        renderNode.hide();

        return;
    }

    camera.addToRenderList(src);

    const children = src.list;

    if (children.length === 0)
    {
        renderNode.hide();

        return;
    }

    renderer.countDirtyState(dirty, children.length);

    renderNode.show();
    renderNode.setAlpha(src.alpha);
    renderNode.setBlendMode(src.blendMode);

    if (src.rotation === 0 && src.scaleX === 1 && src.scaleY === 1)
    {
        renderNode.setXY(src.x, src.y);
    }
    else
    {
        renderNode.setTSR(src.x, src.y, src.scaleX, src.scaleY, src.rotation);
        renderNode.setTransformOrigin(null);
    }

    if (src.mask)
    {
        // TODO
        // container.mask.preRenderCSS(renderer, null, camera);
    }

    if (src.isFrozen)
    {
        if (src._frozenRendered) { return; }

        src._frozenRendered = true;
    }

    const containerElement = renderNode.element;

    for (var i = 0; i < children.length; i++)
    {
        var child = children[i];

        child.renderCSS(renderer, child, camera);

        if (dirty)
        {
            containerElement.appendChild(child.renderNode.element);

            renderer.mutateCount++;
        }
    }

    src.dirty = false;

};

module.exports = ContainerCSSRenderer;
