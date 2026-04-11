const RenderFilters = function (gameObject)
{
    const { renderNode, tintFilter } = gameObject;

    if (gameObject.isTinted)
    {
        renderNode.setProperty('filter', tintFilter.url);
    }
    else if (gameObject.filters._filters.length > 0)
    {
        gameObject.filters.preRender();

        renderNode.setProperty('filter', gameObject.filters.getCSS());
    }
    else
    {
        renderNode.setProperty('filter', null);
    }
};

module.exports = RenderFilters;
