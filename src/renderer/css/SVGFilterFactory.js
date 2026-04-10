const _svgStrings = {
    Blur: require('./filters/blur.svg'),
    ColorMatrix: require('./filters/colormatrix.svg'),
    Tint: require('./filters/tint.svg')
};

const _parser = new DOMParser();

let _svgContainer = null;

let _templates = null;

/**
 * Initializes SVG filter templates by parsing them once
 * @private
 */
function _initializeTemplates ()
{
    if (_templates !== null)
    {
        return; // Already initialized
    }

    _svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    _svgContainer.setAttribute('style', 'position: absolute; width: 0; height: 0; overflow: hidden');

    document.body.appendChild(_svgContainer);

    _templates = {};

    for (const [ type, svgString ] of Object.entries(_svgStrings))
    {
        const { documentElement } = _parser.parseFromString(svgString, 'image/svg+xml');

        if (!(documentElement instanceof SVGElement))
        {
            throw new Error(`Parsed SVG for filter type "${ type }" is not an SVGElement: ${ documentElement }`);
        }

        const template = documentElement.querySelector('filter');

        if (!template)
        {
            throw new Error(`No filter element found in SVG for filter type "${ type }": ${ documentElement }`);
        }

        if (!(template instanceof SVGElement))
        {
            throw new Error(`Filter element for filter type "${ type }" is not an SVGElement`);
        }

        document.adoptNode(template);

        _templates[type] = template;
    }
}

const SVGFilterFactory = function (type)
{
    _initializeTemplates();

    const template = _templates[type];

    if (template === undefined)
    {
        throw new Error(`Unknown filter type "${ type }"`);
    }

    const element = template.cloneNode(true);

    _svgContainer.appendChild(element);

    return element;
};

module.exports = SVGFilterFactory;
