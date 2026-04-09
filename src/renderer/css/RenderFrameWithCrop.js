// For Image, Sprite.
// Sets background, width, height, transform.

const RenderFrameWithCrop = function (gameObject, camera)
{
    const {
        displayOriginX,
        displayOriginY,
        frame,
        renderNode,
        scrollFactorX,
        scrollFactorY
    } = gameObject;

    const {
        scrollX,
        scrollY
    } = camera;

    const sx = (1 - scrollFactorX) * scrollX;
    const sy = (1 - scrollFactorY) * scrollY;

    let frameX = frame.cutX;
    let frameY = frame.cutY;
    let frameWidth = frame.cutWidth;
    let frameHeight = frame.cutHeight;

    let x = gameObject.x - displayOriginX + frame.x + sx;
    let y = gameObject.y - displayOriginY + frame.y + sy;

    let background;

    if (gameObject.isCropped)
    {
        const crop = gameObject._crop;

        frameWidth = crop.cw;
        frameHeight = crop.ch;

        frameX = crop.cx;
        frameY = crop.cy;

        x = -displayOriginX + crop.x + sx;
        y = -displayOriginY + crop.y + sy;

        background = `${-frameX}px ${-frameY}px ${frame.source.cssImage}`;
    }
    else
    {
        background = frame.cssBackground;
    }

    if (frameWidth > 0 && frameHeight > 0)
    {
        renderNode.setProperty('background', background);
        renderNode.setSize(frameWidth, frameHeight);

        if (gameObject.rotation === 0 && gameObject.scaleX === 1 && gameObject.scaleY === 1)
        {
            renderNode.setXY(x, y);
            renderNode.setTransformOrigin(null, null);
        }
        else
        {
            renderNode.setTSR(x, y, gameObject.scaleX, gameObject.scaleY, gameObject.rotation);
            renderNode.setTransformOrigin(displayOriginX, displayOriginY);
        }
    }
    else
    {
        renderNode.hide();
    }

    const { dataset } = renderNode.element;

    dataset.texture = frame.texture.key;
    dataset.frame = frame.name;
    dataset.isCropped = gameObject.isCropped;
};

module.exports = RenderFrameWithCrop;
