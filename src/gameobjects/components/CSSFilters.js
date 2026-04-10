const ColorMatrixFilter = require('../../renderer/css/ColorMatrixFilter');
const CSSFilter = require('../../renderer/css/CSSFilter');
const DropShadowFilter = require('../../renderer/css/DropShadowFilter');
const SVGFilterFactory = require('../../renderer/css/SVGFilterFactory');
const TintFilter = require('../../renderer/css/TintFilter');

class CSSFilters
{
    constructor (renderer)
    {
        this.renderer = renderer;

        // (CSSFilter|DropShadowFilter|SVGFilter)[]
        this._filters = [];

        this._css = null;

        this._isFrozen = false;
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

            if (filter.element)
            {
                filter.element.remove();
            }

            filter.destroy();

            return true;
        }

        return false;
    }

    clear ()
    {
        for (const filter of this._filters)
        {
            if (filter.element)
            {
                filter.element.remove();
            }

            filter.destroy();
        }

        this._filters.length = 0;

        this.unfreeze();
    }

    preRender ()
    {
        if (this._isFrozen)
        {
            return;
        }

        for (const filter of this._filters)
        {
            if (filter.active)
            {
                filter.preRender();
            }
        }
    }

    destroy ()
    {
        this.clear();

        this.renderer = null;
    }

    freeze ()
    {
        this._isFrozen = true;

        this._generateCSS();

        return this;
    }

    unfreeze ()
    {
        this._isFrozen = false;
        this._css = null;

        return this;
    }

    getCSS ()
    {
        return this._isFrozen ? this._css : this._generateCSS();
    }

    _generateCSS ()
    {
        if (this._filters.length === 0)
        {
            this._css = 'none';
        }
        else
        {
            this._css = this._filters.filter(f => f.active).map(f => f.getCSSValue()).join(' ');
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
        return this.add(new DropShadowFilter(offsetX, offsetY, blur, color));
    }

    addGrayscale (amount)
    {
        return this.add(new CSSFilter('grayscale', amount));
    }

    addHueRotate (angle)
    {
        return this.add(new CSSFilter('hue-rotate', angle, 'deg'));
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

    addColorMatrix ()
    {
        const filter = new ColorMatrixFilter(new SVGFilterFactory('ColorMatrix'));

        return this.add(filter);
    }

    addTint (color, mode)
    {
        const filter = new TintFilter(new SVGFilterFactory('Tint'), color, mode);

        return this.add(filter);
    }
}

module.exports = CSSFilters;
