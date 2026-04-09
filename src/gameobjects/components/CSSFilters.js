const IntegerToColor = require('../../display/color/IntegerToColor');
const Color = require('../../display/color/Color');
const CSSFilter = require('../../renderer/css/CSSFilter');
const DropShadowFilter = require('../../renderer/css/DropShadowFilter');

const tempColor = new Color();

class CSSFilters
{
    constructor ()
    {
        // CSSFilter[]
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
        return this.add(new CSSFilter('blur', length, 'px'));
    }

    addBrightness (amount)
    {
        return this.add(new CSSFilter('brightness', amount));
    }

    addContrast (amount)
    {
        return this.add(new CSSFilter('contrast', amount));
    }

    addDropShadow (offsetX, offsetY, blur, color)
    {
        const { rgba } = IntegerToColor(color, tempColor);

        return this.add(new DropShadowFilter(offsetX, offsetY, blur, rgba));
    }

    addGrayscale (amount)
    {
        return this.add(new CSSFilter('grayscale', amount));
    }

    addHueRotate (angle)
    {
        return this.add(new CSSFilter('hue-rotate', angle, 'rad'));
    }

    addInvert (amount)
    {
        return this.add(new CSSFilter('invert', amount));
    }

    addOpacity (amount)
    {
        return this.add(new CSSFilter('opacity', amount));
    }

    addSaturate (amount)
    {
        return this.add(new CSSFilter('saturate', amount));
    }

    addSepia (amount)
    {
        return this.add(new CSSFilter('sepia', amount));
    }

    addURL (url)
    {
        return this.add(new CSSFilter('url', url));
    }
}

module.exports = CSSFilters;
