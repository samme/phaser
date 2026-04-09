// For Blitter, ParticleEmitter.
// Sets transform.

const RenderTransform = function (gameObject, camera)
{
    const {
        renderNode,
        scrollFactorX, scrollFactorY
    } = gameObject;

    const {
        scrollX, scrollY
    } = camera;

    const sx = (1 - scrollFactorX) * scrollX;
    const sy = (1 - scrollFactorY) * scrollY;

    const x = gameObject.x + sx;
    const y = gameObject.y + sy;

    if (gameObject.rotation === 0 && gameObject.scaleX === 1 && gameObject.scaleY === 1)
    {
        renderNode.setXY(x, y);
    }
    else
    {
        renderNode.setTSR(x, y, gameObject.scaleX, gameObject.scaleY, gameObject.rotation);
    }
};

module.exports = RenderTransform;
