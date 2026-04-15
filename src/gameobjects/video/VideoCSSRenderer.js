const RenderFilters = require('../../renderer/css/RenderFilters');
const RenderMask = require('../../renderer/css/RenderMask');
const RenderTransformWithSize = require('../../renderer/css/RenderTransformWithSize');


const VideoCSSRenderer = function (renderer, src, camera)
{
    const { renderNode } = src;

    if (!src.videoTexture)
    {
        renderNode.hide();

        return;
    }

    camera.addToRenderList(src);

    renderNode.show();

    renderNode.setAlpha(src.alpha);
    renderNode.setBlendMode(src.blendMode);

    RenderFilters(src, camera);
    RenderMask(src, camera);
    RenderTransformWithSize(src, camera);
};

module.exports = VideoCSSRenderer;
