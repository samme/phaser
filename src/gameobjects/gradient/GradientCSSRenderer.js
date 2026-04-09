const RenderFilters = require('../../renderer/css/RenderFilters');
const RenderTransformWithSize = require('../../renderer/css/RenderTransformWithSize');
const RenderMask = require('../../renderer/css/RenderMask');

const GradientCSSRenderer = function (renderer, src, camera)
{
    const { renderNode } = src;

    if (!src.willRenderCSS())
    {
        renderNode.hide();

        return;
    }

    camera.addToRenderList(src);

    renderNode.show();

    renderNode.setAlpha(src.alpha);
    renderNode.setBlendMode(src.blendMode);
    renderNode.setProperty('backgroundImage', src.getCSSGradient());

    RenderFilters(src);
    RenderMask(src);
    RenderTransformWithSize(src, camera);
};

module.exports = GradientCSSRenderer;
