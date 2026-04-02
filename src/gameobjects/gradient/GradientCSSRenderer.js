const GradientCSSRenderer = function (renderer, src, camera)
{
    const { renderNode } = src;

    if (!src.willRenderCSS())
    {
        src.renderNode.hide();

        return;
    }

    camera.addToRenderList(src);

    renderNode.show();

    renderNode.setAlpha(src.alpha);
    renderNode.setBlendMode(src.blendMode);
    renderNode.setSize(src.width, src.height);
    renderNode.setProperty('backgroundImage', src.getCSSGradient());

    if (src.rotation === 0 && src.scaleX === 1 && src.scaleY === 1)
    {
        renderNode.setXY(src.x, src.y);
    }
    else
    {
        renderNode.setTSR(src.x - src.displayOriginX, src.y - src.displayOriginY, src.scaleX, src.scaleY, src.rotation);
        renderNode.setTransformOrigin(src.displayOriginX, src.displayOriginY);
    }
};

module.exports = GradientCSSRenderer;
