/**
 * @author       Richard Davey <rich@phaser.io>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Renders this Game Object with the CSS Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Layer#renderCSS
 * @since 3.4.0
 * @private
 *
 * @param {Phaser.Renderer.CSS.CSSRenderer} renderer - A reference to the current active CSS renderer.
 * @param {Phaser.GameObjects.Layer} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 */
var LayerCSSRenderer = function (renderer, src, camera)
{
    const { dirty, renderNode } = src;

    if (!src.willRenderCSS())
    {
        renderNode.hide();

        return;
    }

    camera.addToRenderList(src);

    const children = src.list;

    renderer.countDirtyState(dirty, children.length);

    if (children.length === 0)
    {
        renderNode.hide();

        return;
    }

    renderNode.show();
    renderNode.setBlendMode(src.blendMode);
    renderNode.setAlpha(src.alpha);

    if (src.mask)
    {
        // TODO
        // layer.mask.preRenderCSS(renderer, null, camera);
    }

    if (src.isFrozen)
    {
        if (src._frozenRendered) { return; }

        src._frozenRendered = true;
    }

    for (var i = 0; i < children.length; i++)
    {
        var child = children[i];

        child.renderCSS(renderer, child, camera);

        if (dirty)
        {
            renderNode.element.appendChild(child.renderNode.element);

            renderer.mutateCount++;
        }
    }

    src.dirty = false;

};

module.exports = LayerCSSRenderer;
