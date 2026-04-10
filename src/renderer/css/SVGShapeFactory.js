const _svgStrings = {
    Arc: require('./shapes/arc.svg'),
    Circle: require('./shapes/circle.svg'),
    Curve: require('./shapes/curve.svg'),
    Ellipse: require('./shapes/ellipse.svg'),
    Grid: require('./shapes/grid.svg'),
    IsoBox: require('./shapes/isobox.svg'),
    IsoTriangle: require('./shapes/isotriangle.svg'),
    Line: require('./shapes/line.svg'),
    Polygon: require('./shapes/polygon.svg'),
    Rectangle: require('./shapes/rectangle.svg'),
    Star: require('./shapes/star.svg'),
    Triangle: require('./shapes/triangle.svg')
};

const _parser = new DOMParser();

let _templates = null;

/**
 * Initializes SVG templates by parsing them once
 * @private
 */
function _initializeTemplates ()
{
    if (_templates !== null)
    {
        return; // Already initialized
    }

    _templates = {};

    for (const [ type, svgString ] of Object.entries(_svgStrings))
    {
        const { documentElement: svg } = _parser.parseFromString(svgString, 'image/svg+xml');

        svg.style.display = 'block';
        svg.style.overflow = 'visible';

        _templates[type] = svg;
    }
}

const SVGShapeFactory = function (type)
{
    _initializeTemplates();

    const template = _templates[type];

    if (template === undefined)
    {
        throw new Error(`Unknown shape type "${ type }"`);
    }

    return template.cloneNode(true);
};

module.exports = SVGShapeFactory;
