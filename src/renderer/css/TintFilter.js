const Color = require('../../display/color/Color');
const CSSTintModes = require('./CSSTintModes');
const IntegerToColor = require('../../display/color/IntegerToColor');
const SVGFilter = require('./SVGFilter');

class TintFilter extends SVGFilter
{
    constructor (element, color, mode)
    {
        super('tint', element);

        this.flood = element.querySelector('feFlood');
        this.blend = element.querySelector('feBlend');

        this._colorObject = new Color();

        this._color = -1;
        this._mode = -1;

        this.color = color;
        this.mode = mode;
    }

    get color ()
    {
        return this._color;
    }

    set color (value)
    {
        this._color = value;

        IntegerToColor(this._color, this._colorObject);

        this.flood.setAttribute('flood-color', this._colorObject.rgba);
    }

    get mode ()
    {
        return this._mode;
    }

    set mode (value)
    {
        const mode = CSSTintModes[value];

        if (!mode)
        {
            throw new Error(`Invalid tint mode: ${value}`);
        }

        this._mode = value;

        this.blend.setAttribute('mode', mode);
    }
}

module.exports = TintFilter;
