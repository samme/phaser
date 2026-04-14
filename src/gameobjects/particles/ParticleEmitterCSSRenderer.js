const RenderFilters = require('../../renderer/css/RenderFilters');
const RenderMask = require('../../renderer/css/RenderMask');
const RenderTransform = require('../../renderer/css/RenderTransform');

const RectangleToRectangle = require('../../geom/intersects/RectangleToRectangle');

/**
 * Renders this Game Object with the CSS Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Particles.Emitter#renderCSS
 * @since 4.0.0
 * @private
 *
 * @param {Phaser.Renderer.CSS.CSSRenderer} renderer - A reference to the current active CSS renderer.
 * @param {Phaser.GameObjects.Particles.ParticleEmitter} emitter - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 */
const ParticleEmitterCSSRenderer = function (renderer, emitter, camera)
{
    const aliveParticles = emitter.alive;
    const aliveCount = aliveParticles.length;
    const deadParticles = emitter.dead;
    const deadCount = deadParticles.length;
    const viewBounds = emitter.viewBounds;

    if (!emitter.visible || aliveCount === 0 || (viewBounds && !RectangleToRectangle(viewBounds, camera.worldView)))
    {
        emitter.renderNode.hide();

        return;
    }

    camera.addToRenderList(emitter);

    renderer.drawCount += aliveCount;

    const { blendMode, renderNode } = emitter;

    renderNode.show();
    renderNode.setAlpha(emitter.alpha);

    RenderFilters(emitter);
    RenderMask(emitter);
    RenderTransform(emitter, camera);

    if (emitter.sortCallback)
    {
        emitter.depthSort();
    }

    const emitterElement = renderNode.element;

    for (let i = 0; i < aliveCount; i++)
    {
        const particle = aliveParticles[i];
        const particleRenderNode = particle.renderNode;
        const dirty = particle.dirty;

        renderer.countDirtyState(dirty, 1);

        if (dirty)
        {
            emitterElement.appendChild(particleRenderNode.element);

            particle.dirty = false;

            renderer.mutateCount++;
        }

        const alpha = particle.alpha;

        if (alpha <= 0 || particle.scaleX === 0 || particle.scaleY === 0)
        {
            particleRenderNode.hide();

            continue;
        }

        const frame = particle.frame;

        if (frame.cutWidth > 0 && frame.cutHeight > 0)
        {
            particleRenderNode.show();
            particleRenderNode.setAlpha(alpha);
            particleRenderNode.setBlendMode(blendMode);
            particleRenderNode.setProperty('background', frame.cssBackground);
            particleRenderNode.setSize(frame.cutWidth, frame.cutHeight);

            // center (particle.x, particle.y) -> top-left (x, y)
            const x = particle.x - frame.halfWidth;
            const y = particle.y - frame.halfHeight;

            if (particle.rotation === 0 && particle.scaleX === 1 && particle.scaleY === 1)
            {
                particleRenderNode.setXY(x, y);
            }
            else
            {
                particleRenderNode.setTRS(x, y, particle.rotation, particle.scaleX, particle.scaleY);
                particleRenderNode.setTransformOrigin(frame.halfWidth, frame.halfHeight);
            }
        }
        else
        {
            particleRenderNode.hide();
        }
    }

    for (let i = 0; i < deadCount; i++)
    {
        const particle = deadParticles[i];
        const dirty = particle.dirty;

        renderer.countDirtyState(dirty, 1);

        if (dirty)
        {
            renderer.removeRenderNode(particle.renderNode);

            particle.dirty = false;
        }
    }
};

module.exports = ParticleEmitterCSSRenderer;
