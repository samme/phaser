const SVG_ARC = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><polygon data-shape-type="Arc" points="50,0 100,50 50,100 0,50 50,0" fill="skyblue" stroke="white" stroke-width="2"/></svg>';
const SVG_CIRCLE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle data-shape-type="Circle" cx="50" cy="50" r="50" fill="coral" stroke="white" stroke-width="2"/></svg>';
const SVG_CURVE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><path data-shape-type="Curve" d="M 0 100 Q 50 0 100 100 Z" fill="lightseagreen" stroke="white" stroke-width="2"/></svg>';
const SVG_ELLIPSE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><ellipse data-shape-type="Ellipse" cx="50" cy="50" rx="50" ry="30" fill="plum" stroke="white" stroke-width="2"/></svg>';
const SVG_GRID = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><g data-shape-type="Grid"><rect x="0" y="0" width="50" height="50" fill="khaki" stroke="white" stroke-width="2" /><rect x="50" y="0" width="50" height="50" fill="khaki" stroke="white" stroke-width="2" /><rect x="0" y="50" width="50" height="50" fill="khaki" stroke="white" stroke-width="2" /><rect x="50" y="50" width="50" height="50" fill="khaki" stroke="white" stroke-width="2" /></g></svg>';
const SVG_ISOBOX = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><g data-shape-type="IsoBox"><polygon data-face="top" points="50,0 100,25 50,50 0,25" fill="lightyellow" /><polygon data-face="left" points="0,25 50,50 50,100 0,75" fill="lightcoral" /><polygon data-face="right" points="50,50 100,25 100,75 50,100" fill="wheat" /></g></svg>';
const SVG_ISOTRIANGLE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><g data-shape-type="IsoTriangle"><polygon data-face="top" points="50,25 100,50 0,50" fill="lightyellow" /><polygon data-face="left" points="0,50 50,25 50,100" fill="lightcoral" /><polygon data-face="right" points="50,25 100,50 50,100" fill="wheat" /></g></svg>';
const SVG_LINE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><line data-shape-type="Line" x1="0" y1="50" x2="100" y2="50" stroke="white" stroke-width="2"/></svg>';
const SVG_POLYGON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><polygon data-shape-type="Polygon" points="50,0 100,38 81,100 19,100 0,38" fill="gold" stroke="white" stroke-width="2"/></svg>';
const SVG_RECTANGLE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect data-shape-type="Rectangle" x="0" y="0" width="100" height="100" fill="lightsteelblue" stroke="white" stroke-width="2"/></svg>';
const SVG_STAR = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><polygon data-shape-type="Star" points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" fill="gold" stroke="white" stroke-width="2"/></svg>';
const SVG_TRIANGLE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><polygon data-shape-type="Triangle" points="50,0 100,100 0,100" fill="salmon" stroke="white" stroke-width="2"/></svg>';

const SVG_STRINGS = {
    Arc: SVG_ARC,
    Circle: SVG_CIRCLE,
    Curve: SVG_CURVE,
    Ellipse: SVG_ELLIPSE,
    Grid: SVG_GRID,
    IsoBox: SVG_ISOBOX,
    IsoTriangle: SVG_ISOTRIANGLE,
    Line: SVG_LINE,
    Polygon: SVG_POLYGON,
    Rectangle: SVG_RECTANGLE,
    Star: SVG_STAR,
    Triangle: SVG_TRIANGLE
};

const _parser = new DOMParser();

/**
 * Creates a minimal SVG element for the given Phaser shape type,
 * within a viewBox of "0 0 100 100". The returned SVG element
 * is suitable for later updates to geometry, fill, and stroke.
 *
 * Supported types:
 * - Arc
 * - Circle
 * - Curve
 * - Ellipse
 * - Grid
 * - IsoBox
 * - IsoTriangle
 * - Line
 * - Polygon
 * - Rectangle
 * - Star
 * - Triangle
 *
 * @function SVGShapeFactory
 * @since 5.0.0
 *
 * @param {string} type - The Phaser shape type name, e.g. 'Ellipse'.
 *
 * @returns {SVGSVGElement} A complete SVG element containing the shape.
 */
const SVGShapeFactory = function (type)
{
    const svgString = SVG_STRINGS[type];

    if (svgString === undefined)
    {
        throw new Error(`Unknown shape type "${ type }"`);
    }

    const {documentElement: svg} = _parser.parseFromString(svgString, 'image/svg+xml');

    svg.style.display = 'block';
    svg.style.overflow = 'visible';

    return svg;
};

module.exports = SVGShapeFactory;
