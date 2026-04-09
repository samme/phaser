class CSSFilter
{
    constructor (name, value, unit = '')
    {
        this.name = name;
        this.value = value;
        this.unit = unit;
        this.active = true;
    }

    toString ()
    {
        return `${this.name}(${this.value}${this.unit})`;
    }
}

module.exports = CSSFilter;
