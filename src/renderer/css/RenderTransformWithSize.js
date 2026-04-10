// For Game Objects with width, height, origin, transform.
// Sets width, height, transform.

const RenderTransformWithSize = function (gameObject, camera)
{
    const {
        renderNode,
        width, height,
        displayOriginX, displayOriginY,
        scrollFactorX, scrollFactorY
    } = gameObject;

    const {
        scrollX, scrollY
    } = camera;

    const sx = (1 - scrollFactorX) * scrollX;
    const sy = (1 - scrollFactorY) * scrollY;

    const x = gameObject.x - displayOriginX + sx;
    const y = gameObject.y - displayOriginY + sy;

    renderNode.setSize(width, height);

    if (gameObject.rotation === 0 && gameObject.scaleX === 1 && gameObject.scaleY === 1)
    {
        renderNode.setXY(x, y);
        renderNode.setTransformOrigin(null, null);
    }
    else
    {
        renderNode.setTRS(x, y, gameObject.rotation, gameObject.scaleX, gameObject.scaleY);
        renderNode.setTransformOrigin(displayOriginX, displayOriginY);
    }
};

module.exports = RenderTransformWithSize;
