const RenderFilters = require('../../renderer/css/RenderFilters');
const RenderMask = require('../../renderer/css/RenderMask');
const RenderTransformWithSize = require('../../renderer/css/RenderTransformWithSize');

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

    const { alpha, blendMode } = src;

    renderNode.setAlpha(alpha);
    renderNode.setBlendMode(blendMode);
    renderNode.setProperty('backgroundImage', src.getCSSBackground());

    RenderFilters(src);
    RenderMask(src);
    RenderTransformWithSize(src, camera);
};

module.exports = PointLightCSSRenderer;
