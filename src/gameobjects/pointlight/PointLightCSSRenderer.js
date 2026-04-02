

const PointLightCSSRenderer = function (renderer, src, camera)
{
    const { renderNode } = src;

    if (!src.willRenderCSS())
    {
        src.renderNode.hide();

        return;
    }

    camera.addToRenderList(src);

    renderNode.show();

    const { alpha, blendMode, width, height, x, y, radius } = src;

    renderNode.setAlpha(alpha);
    renderNode.setBlendMode(blendMode);
    renderNode.setSize(width, height);
    renderNode.setProperty('backgroundImage', src.getCSSBackground());

    renderNode.setXY(x - radius, y - radius);
};

module.exports = PointLightCSSRenderer;
