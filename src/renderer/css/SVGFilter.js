let idCounter = 0;

class SVGFilter
{
    constructor (name, element)
    {
        this.name = name;
        this.element = element;

        const id = `${name}-filter-${idCounter++}`;

        element.setAttribute('id', id);

        this.url = `url(#${id})`;
        this.active = true;
    }

    preRender ()
    {
        // Can be overridden.
    }

    destroy ()
    {
        this.active = false;
        this.element = null;
    }

    getCSSValue ()
    {
        return this.url;
    }
}

module.exports = SVGFilter;
