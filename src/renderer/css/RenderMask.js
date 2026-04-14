const RenderMask = function (gameObject)
{
    const { mask, renderNode } = gameObject;

    if (mask && mask.active)
    {
        renderNode.setProperty(mask.name, mask.getCSSValue());
    }
    else
    {
        renderNode.setProperty('clipPath', null);
        renderNode.setProperty('mask', null);
    }
};

module.exports = RenderMask;
