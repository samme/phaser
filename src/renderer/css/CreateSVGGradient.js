const parser = new DOMParser();

function parseSVG (source)
{
    return parser.parseFromString(source, 'image/svg+xml').documentElement;
}

const linear = parseSVG(require('./gradients/linear.svg'));
const radial = parseSVG(require('./gradients/radial.svg'));
const unsupported = parseSVG(require('./gradients/unsupported.svg'));

const templates = {
    0: linear,
    1: unsupported,
    2: radial,
    3: unsupported,
    4: unsupported
};

let idCounter = 0;

/**
 * Creates an SVG element for displaying a gradient.
 * The SVG is cloned from a cached template and returned as a DOM element.
 * Use `UpdateSVGGradient` to populate it with gradient data.
 *
 * Only 0 (LINEAR) or 2 (RADIAL) shape modes are supported.
 * Other modes will return a plain black rectangle.
 *
 * @function CreateSVGGradient
 * @since 4.0.0
 *
 * @param {number} shapeMode - 0 (LINEAR) or 2 (RADIAL).
 * @returns {SVGSVGElement} The root SVG element.
 */
const CreateSVGGradient = function (shapeMode)
{
    const template = templates[shapeMode];

    if (!template)
    {
        throw new Error(`Unsupported shape mode: ${shapeMode}`);
    }

    const svg = template.cloneNode(true);

    svg.dataset.shapeMode = shapeMode;

    if (shapeMode === 1 || shapeMode === 3 || shapeMode === 4)
    {
        return svg;
    }

    const id = `gradient-${idCounter++}`;
    const gradientEl = svg.querySelector('linearGradient, radialGradient');
    const rect = svg.querySelector('rect');

    gradientEl.id = id;

    rect.setAttribute('fill', `url(#${id})`);

    return svg;
};

module.exports = CreateSVGGradient;
