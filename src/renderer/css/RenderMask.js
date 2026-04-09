const RenderMask = function (gameObject)
{
    const { mask } = gameObject;

    if (mask)
    {
        gameObject.renderNode.setProperty(mask.name, mask.getCSSValue());
    }
};

module.exports = RenderMask;
