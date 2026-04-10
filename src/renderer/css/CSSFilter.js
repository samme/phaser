class CSSFilter
{
    constructor (name, value, unit = '')
    {
        this.name = name;
        this.value = value;
        this.unit = unit;
        this.active = true;
    }

    getCSSValue ()
    {
        return `${this.name}(${this.value}${this.unit})`;
    }

    preRender ()
    {
        // Nothing to do.
    }

    destroy ()
    {
        this.active = false;
    }
}

module.exports = CSSFilter;
