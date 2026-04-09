const RenderFilters = function (gameObject)
{
    const { renderNode } = gameObject;

    if (gameObject.isTinted)
    {
        renderNode.setProperty('filter', tintNode.url);
    }
    else if (gameObject.filters._filters.length > 0)
    {
        renderNode.setProperty('filter', gameObject.filters.getCSS());
    }
    else
    {
        renderNode.setProperty('filter', null);
    }
};

module.exports = RenderFilters;
