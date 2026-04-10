const Color = require('../../display/color/Color');
const CSSFilter = require('./CSSFilter');
const IntegerToColor = require('../../display/color/IntegerToColor');

class DropShadowFilter extends CSSFilter
{
    constructor (offsetX, offsetY, blur, color)
    {
        super('drop-shadow', null, '');

        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.blur = blur;
        this.active = true;

        this._colorObject = new Color();

        this._color = -1;

        this.color = color;
    }

    get color ()
    {
        return this._color;
    }

    set color (value)
    {
        if (value !== this._color)
        {
            this._color = value;

            IntegerToColor(this._color, this._colorObject);
        }
    }

    getCSSValue ()
    {
        return `drop-shadow(${this.offsetX}px ${this.offsetY}px ${this.blur}px ${this._colorObject.rgba})`;
    }

    destroy ()
    {
        this.active = false;
        this._colorObject = null;
    }
}

module.exports = DropShadowFilter;
