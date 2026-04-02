const Color = require('../../display/color/Color');
const CSSTintModes = require('./CSSTintModes');
const IntegerToColor = require('../../display/color/IntegerToColor');

const defaultColor = 0xffffff;
const defaultMode = 0;
const tempColor = new Color();

const svgString = `
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="0" height="0">
    <filter id="">
        <feFlood flood-color="" result="flood" />
        <feComposite in="flood" in2="SourceGraphic" operator="in" result="composite" />
        <feBlend in="composite" in2="SourceGraphic" mode="" />
    </filter>
</svg>
`;

const svgDoc = new DOMParser().parseFromString(svgString, 'image/svg+xml');
const templateFilter = svgDoc.querySelector('filter');

let idCounter = 0;

class CSSTintNode
{
    constructor ()
    {
        this.element = templateFilter.cloneNode(true);
        this.floodElement = this.element.querySelector('feFlood');
        this.blendElement = this.element.querySelector('feBlend');

        this.color = -1;
        this.mode = -1;

        const id = `tint-${idCounter++}`;

        this.url = `url(#${id})`;

        this.element.setAttribute('id', id);

        this.clear();
    }

    setColor (value)
    {
        if (this.color !== value)
        {
            this.color = value;

            IntegerToColor(value, tempColor);

            this.floodElement.setAttribute('flood-color', tempColor.rgba);
        }
    }

    setMode (value)
    {
        if (this.mode !== value)
        {
            this.mode = value;

            const blendMode = CSSTintModes[value];

            if (blendMode === undefined)
            {
                throw new Error(`Invalid tint mode: ${value}`);
            }

            this.blendElement.setAttribute('mode', blendMode);
        }
    }

    clear ()
    {
        this.setColor(defaultColor);
        this.setMode(defaultMode);
    }

    destroy ()
    {
        // Renderer will remove element.

        this.element = null;
        this.floodElement = null;
        this.blendElement = null;
        this.color = -1;
        this.mode = -1;
    }
}

module.exports = CSSTintNode;
