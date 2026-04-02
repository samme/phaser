const IntegerToColor = require('../../display/color/IntegerToColor');
const Color = require('../../display/color/Color');

const tempColor = new Color();

const toStringUnitless = function ()
{
    return `${this.name}(${this.value})`;
};

const toStringPixels = function ()
{
    return `${this.name}(${this.value}px)`;
};

const toStringRadians = function ()
{
    return `${this.name}(${this.value}rad)`;
};

const toStringDropShadow = function ()
{
    const { offsetX, offsetY, blur, color } = this.value;
    const { rgba } = IntegerToColor(color, tempColor);

    return `${this.name}(${offsetX}px ${offsetY}px ${blur}px ${rgba})`;
};

class CSSFilters
{
    constructor ()
    {
        // { name: string, value: number | object, active: boolean, toString: function }[]
        this._filters = [];
        this._css = null;
    }

    add (filter)
    {
        this._filters.push(filter);

        return filter;
    }

    remove (filter)
    {
        const index = this._filters.indexOf(filter);

        if (index > -1)
        {
            this._filters.splice(index, 1);

            return true;
        }

        return false;
    }

    clear ()
    {
        this._filters.length = 0;
    }

    freeze ()
    {
        this._frozen = true;

        this._generateCSS();

        return this;
    }

    unfreeze ()
    {
        this._frozen = false;
        this._css = null;

        return this;
    }

    getCSS ()
    {
        return this._frozen ? this._css : this._generateCSS();
    }

    _generateCSS ()
    {
        if (this._filters.length === 0)
        {
            this._css = 'none';
        }
        else
        {
            this._css = this._filters.filter(f => f.active).map(f => f.toString()).join(' ');
        }

        return this._css;
    }

    addBlur (length)
    {
        return this.add({ name: 'blur', value: length, active: true, toString: toStringPixels });
    }

    addBrightness (amount)
    {
        return this.add({ name: 'brightness', value: amount, active: true, toString: toStringUnitless });
    }

    addContrast (amount)
    {
        return this.add({ name: 'contrast', value: amount, active: true, toString: toStringUnitless });
    }

    addDropShadow (offsetX, offsetY, blur, color)
    {
        return this.add({ name: 'drop-shadow', value: { offsetX, offsetY, blur, color }, active: true, toString: toStringDropShadow });
    }

    addGrayscale (amount)
    {
        return this.add({ name: 'grayscale', value: amount, active: true, toString: toStringUnitless });
    }

    addHueRotate (angle)
    {
        return this.add({ name: 'hue-rotate', value: angle, active: true, toString: toStringRadians });
    }

    addInvert (amount)
    {
        return this.add({ name: 'invert', value: amount, active: true, toString: toStringUnitless });
    }

    addOpacity (amount)
    {
        return this.add({ name: 'opacity', value: amount, active: true, toString: toStringUnitless });
    }

    addSaturate (amount)
    {
        return this.add({ name: 'saturate', value: amount, active: true, toString: toStringUnitless });
    }

    addSepia (amount)
    {
        return this.add({ name: 'sepia', value: amount, active: true, toString: toStringUnitless });
    }

    addURL (url)
    {
        return this.add({ name: 'url', value: url, active: true, toString: toStringUnitless });
    }
}

module.exports = CSSFilters;
