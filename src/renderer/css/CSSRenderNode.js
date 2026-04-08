const CSSBlendModes = require('./CSSBlendModes');
const Color = require('../../display/color/Color');
const IntegerToColor = require('../../display/color/IntegerToColor');

// Transform modes:
const XY = 0; //  translate only
const TSR = 1; // translate, scale, rotate
const SRT = 2; // scale, rotate, translate

const tempColor = new Color();

let warningsCount = 0;

if (typeof CSS_DEBUG)
{
    console.log('CSS_DEBUG is enabled. Style property changes will be verified (up to 100 times). This is slow.');
}
else
{
    console.log('CSS_DEBUG is disabled. Style property changes will not be verified.');
}

class CSSRenderNode
{
    constructor (element)
    {
        if (!element) { throw new Error('Missing element'); }

        // console.count('create CSSRenderNode');

        this.element = element;

        this.properties = {};

        this._alpha = undefined;
        this._backgroundColor = undefined;
        this._blendMode = undefined;
        this._height = undefined;
        this._ox = undefined;
        this._oy = undefined;
        this._rotation = undefined;
        this._scaleX = undefined;
        this._scaleY = undefined;
        this._transformType = undefined;
        this._tx = undefined;
        this._ty = undefined;
        this._visible = undefined;
        this._width = undefined;

        this.clearDataset();

        element.replaceChildren();

        element.setAttribute('style', '');
        element.style.position = 'absolute';
        element.style.left = '0';
        element.style.top = '0';
    }

    setAlpha (value)
    {
        if (this._alpha !== value)
        {
            this._alpha = value;
            this.setProperty('opacity', value);
        }
    }

    setBackgroundColor (value)
    {
        if (this._backgroundColor !== value)
        {
            this._backgroundColor = value;

            if (value !== null)
            {
                IntegerToColor(value, tempColor);

                this.setProperty('backgroundColor', tempColor.rgba);
            }
            else
            {
                this.setProperty('backgroundColor', null);
            }
        }
    }

    setBlendMode (value)
    {
        if (this._blendMode !== value)
        {
            this._blendMode = value;
            this.setProperty('mixBlendMode', CSSBlendModes[value]);
        }
    }

    setId (id)
    {
        this.element.dataset.id = id;
    }

    setKey (key)
    {
        this.element.dataset.key = key;
    }

    setName (name)
    {
        this.element.dataset.name = name;
    }

    setSize (width, height)
    {
        if (this._width !== width || this._height !== height)
        {
            this._width = width;
            this._height = height;
            this.setProperty('width', `${width}px`);
            this.setProperty('height', `${height}px`);
        }
    }

    setType (type)
    {
        this.element.dataset.type = type;
    }

    setTransformOrigin (ox, oy)
    {
        if (this._ox !== ox || this._oy !== oy)
        {
            if (ox === null)
            {
                this._ox = null;
                this._oy = null;
                this.setProperty('transformOrigin', null);
            }
            else
            {
                this._ox = ox;
                this._oy = oy;
                this.setProperty('transformOrigin', `${ox}px ${oy}px`);
            }
        }
    }

    setTSR (tx, ty, scaleX, scaleY, rotation)
    {
        if (this._transformType !== TSR || this._tx !== tx || this._ty !== ty || this._scaleX !== scaleX || this._scaleY !== scaleY || this._rotation !== rotation)
        {
            this._tx = tx;
            this._ty = ty;
            this._scaleX = scaleX;
            this._scaleY = scaleY;
            this._rotation = rotation;
            this._transformType = TSR;

            this.setProperty('transform', `translate(${tx}px, ${ty}px) scale(${scaleX}, ${scaleY}) rotate(${rotation}rad)`);
        }
    }

    setSRT (scaleX, scaleY, rotation, tx, ty)
    {
        if (this._transformType !== SRT || this._tx !== tx || this._ty !== ty || this._scaleX !== scaleX || this._scaleY !== scaleY || this._rotation !== rotation)
        {
            this._tx = tx;
            this._ty = ty;
            this._scaleX = scaleX;
            this._scaleY = scaleY;
            this._rotation = rotation;
            this._transformType = SRT;

            this.setProperty('transform', `scale(${scaleX}, ${scaleY}) rotate(${rotation}rad) translate(${tx}px, ${ty}px)`);
        }
    }

    setXY (tx, ty)
    {
        if (this._transformType !== XY || this._tx !== tx || this._ty !== ty)
        {
            this._tx = tx;
            this._ty = ty;
            this._transformType = XY;

            this.setProperty('transform', `translate(${tx}px, ${ty}px)`);
        }
    }

    setProperty (name, value)
    {
        if (typeof CSS_DEBUG)
        {
            if (name.includes('-'))
            {
                throw new TypeError(`Use 🐪 camelCase instead of ${name}.`);
            }

            if (value === undefined || value === false || value === true)
            {
                throw new TypeError(`Bad property value: ${value}`);
            }
        }

        // We want to cache string or null values only.
        if (typeof value === 'number')
        {
            value = String(value);
        }

        if (this.properties[name] !== value)
        {
            this.properties[name] = value;
            this.element.style[name] = value;

            if (typeof CSS_DEBUG)
            {
                const newValue = this.element.style.getPropertyValue(name);

                // This is oversensitive but it catches mistakes during development.
                if (value !== newValue)
                {
                    if (warningsCount < 100)
                    {
                        console.warn(`Set style ${name} = '${value}' but the actual value is '${newValue}'`);

                        warningsCount++;
                    }
                }
            }
        }
    }

    hide ()
    {
        if (this._visible !== false)
        {
            this._visible = false;
            this.setProperty('display', 'none');
        }
    }

    show ()
    {
        if (this._visible !== true)
        {
            this._visible = true;
            this.setProperty('display', 'block');
        }
    }

    clearDataset ()
    {
        const { dataset } = this.element;

        for (const key of Object.keys(dataset))
        {
            delete dataset[key];
        }
    }

    destroy ()
    {
        // console.count('destroy CSSRenderNode');

        this.clearDataset();

        this.element = null;
        this.properties = null;

        // CSSRenderer will release the HTMLElement.
    }
}

module.exports = CSSRenderNode;
