const ColorMatrix = require('../../display/ColorMatrix');
const SVGFilter = require('./SVGFilter');

class ColorMatrixFilter extends SVGFilter
{
    constructor (element)
    {
        super('colorMatrix', element);

        this.colorMatrix = new ColorMatrix();

        this.colorMatrixElement = element.querySelector('feColorMatrix');
    }

    preRender ()
    {
        this.colorMatrixElement.setAttribute('values', this.colorMatrix.getSVGString());
    }

    destroy ()
    {
        this.colorMatrix = null;
        this.colorMatrixElement = null;

        super.destroy();
    }
}

module.exports = ColorMatrixFilter;
