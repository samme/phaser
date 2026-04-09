const RenderFilters = require('../../renderer/css/RenderFilters');
const RenderMask = require('../../renderer/css/RenderMask');
const RenderTransform = require('../../renderer/css/RenderTransform');

/**
 * Renders this Game Object with the CSS Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Blitter#renderCSS
 * @since 5.0.0
 * @private
 *
 * @param {Phaser.Renderer.CSS.CSSRenderer} renderer - A reference to the current active CSS renderer.
 * @param {Phaser.GameObjects.Blitter} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 */
const BlitterCSSRenderer = function (renderer, src, camera)
{
    const { renderNode } = src;
    const { list } = src.children;

    if (!src.willRenderCSS() || list.length === 0)
    {
        renderNode.hide();

        return;
    }

    // For now addToRenderList() is required for correct pointer input.
    camera.addToRenderList(src);

    const { dirty } = src;

    renderer.countDirtyState(dirty, list.length);

    renderNode.show();
    renderNode.setAlpha(src.alpha);
    renderNode.setBlendMode(src.blendMode);

    RenderFilters(src);
    RenderMask(src);
    RenderTransform(src, camera);

    if (src.isFrozen)
    {
        if (src._frozenRendered) { return; }

        src._frozenRendered = true;
    }

    for (let i = 0; i < list.length; i++)
    {

        const bob = list[i];
        const bobRenderNode = bob.renderNode;

        if (!bob.visible || bob.alpha === 0)
        {
            bobRenderNode.hide();
        }
        else
        {
            const frame = bob.frame;
            const frameWidth = frame.cutWidth;
            const frameHeight = frame.cutHeight;

            if (frameWidth > 0 && frameHeight > 0)
            {
                bobRenderNode.show();
                bobRenderNode.setAlpha(bob.alpha);
                bobRenderNode.setProperty('background', frame.cssBackground);
                bobRenderNode.setSize(frameWidth, frameHeight);
                bobRenderNode.setXY(bob.x + frame.x, bob.y + frame.y);
            }
            else
            {
                bobRenderNode.hide();
            }
        }

        if (dirty)
        {
            renderer.appendChildToParentRenderNode(bobRenderNode, renderNode);
        }
    }

    renderer.drawCount += list.length;

    src.dirty = false;
};

module.exports = BlitterCSSRenderer;
