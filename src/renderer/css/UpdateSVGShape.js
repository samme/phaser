// WIP
/**
 * Converts a Phaser integer color value to a CSS hex string.
 *
 * @param {number} color - Integer color, 0 to 0xffffff.
 * @returns {string} CSS hex string, e.g. '#ff0000'.
 */
const toSVGColor = function (color)
{
    return `#${ (color & 0xffffff).toString(16).padStart(6, '0')}`;
};

/**
 * Updates the shared style attributes (fill, stroke, opacity) on a single
 * SVG element from the Phaser shape's current state.
 *
 * Not used for IsoBox, IsoTriangle, or Grid, which manage their own fills.
 *
 * @param {Phaser.GameObjects.Shape} shape
 * @param {SVGElement} el - The inner shape element (circle, rect, polygon, etc.)
 */
const updateStyle = function (shape, el)
{
    if (shape.isFilled)
    {
        el.setAttribute('fill', toSVGColor(shape.fillColor));
        el.setAttribute('fill-opacity', shape.fillAlpha);
    }
    else
    {
        el.setAttribute('fill', 'none');
    }

    if (shape.isStroked)
    {
        el.setAttribute('stroke', toSVGColor(shape.strokeColor));
        el.setAttribute('stroke-opacity', shape.strokeAlpha);
        el.setAttribute('stroke-width', shape.lineWidth);
    }
    else
    {
        el.setAttribute('stroke', 'none');
    }
};

/**
 * Updates the root <svg> element's viewBox, width, and height to match
 * the shape's current geometry dimensions.
 *
 * @param {Phaser.GameObjects.Shape} shape
 * @param {SVGSVGElement} svg
 */
const updateViewBox = function (shape, svg)
{
    const w = shape.width;
    const h = shape.height;

    svg.setAttribute('viewBox', `0 0 ${ w } ${ h}`);
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);
};

// ---------------------------------------------------------------------------
// Per-shape geometry updaters
// ---------------------------------------------------------------------------

const updateCircle = function (shape, svg)
{
    const el = shape.elements.Circle;
    const r = shape.geom.radius;

    el.setAttribute('cx', r);
    el.setAttribute('cy', r);
    el.setAttribute('r', r);

    updateViewBox(shape, svg);
    updateStyle(shape, el);
};

const updateCurve = function (shape, svg)
{
    const el = shape.elements.Curve;
    const path = shape.pathData;

    if (!path || path.length < 2)
    {
        return;
    }

    const dx = shape._curveBounds.x;
    const dy = shape._curveBounds.y;

    let pathLength = path.length - 1;

    if (!shape.closePath)
    {
        pathLength -= 2;
    }

    let d = `M ${ path[0] - dx } ${ path[1] - dy }`;

    for (let i = 2; i < pathLength; i += 2)
    {
        d += ` L ${ path[i] - dx } ${ path[i + 1] - dy }`;
    }

    el.setAttribute('d', d);
    updateViewBox(shape, svg);
    updateStyle(shape, el);
};

const updateEllipse = function (shape, svg)
{
    const el = shape.elements.Ellipse;
    const w = shape.width;
    const h = shape.height;

    el.setAttribute('cx', w / 2);
    el.setAttribute('cy', h / 2);
    el.setAttribute('rx', w / 2);
    el.setAttribute('ry', h / 2);

    updateViewBox(shape, svg);
    updateStyle(shape, el);
};

const updateGrid = function (shape, svg)
{
    const g = shape.elements.Grid;

    //  Remove all existing cell rects
    while (g.firstChild)
    {
        g.removeChild(g.firstChild);
    }

    const ns = 'http://www.w3.org/2000/svg';
    const totalWidth = shape.width;
    const totalHeight = shape.height;
    const {cellWidth} = shape;
    const {cellHeight} = shape;
    const padding = shape.cellPadding;

    const fillColor = shape.isFilled ? toSVGColor(shape.fillColor) : 'none';
    const fillAlpha = shape.isFilled ? shape.fillAlpha : 1;
    const altFillColor = shape.showAltCells ? toSVGColor(shape.altFillColor) : fillColor;
    const altFillAlpha = shape.showAltCells ? shape.altFillAlpha : fillAlpha;

    const strokeColor = shape.isStroked ? toSVGColor(shape.strokeColor) : 'none';
    const strokeAlpha = shape.isStroked ? shape.strokeAlpha : 1;

    let col = 0;
    let row = 0;

    for (let y = 0; y < totalHeight; y += cellHeight)
    {
        col = 0;

        for (let x = 0; x < totalWidth; x += cellWidth)
        {
            const isAlt = (col + row) % 2 === 1;
            const rect = document.createElementNS(ns, 'rect');

            rect.setAttribute('x', x + padding);
            rect.setAttribute('y', y + padding);
            rect.setAttribute('width', Math.min(cellWidth - padding * 2, totalWidth - x - padding));
            rect.setAttribute('height', Math.min(cellHeight - padding * 2, totalHeight - y - padding));
            rect.setAttribute('fill', isAlt ? altFillColor : fillColor);
            rect.setAttribute('fill-opacity', isAlt ? altFillAlpha : fillAlpha);
            rect.setAttribute('stroke', strokeColor);
            rect.setAttribute('stroke-opacity', strokeAlpha);
            rect.setAttribute('stroke-width', shape.lineWidth);

            g.appendChild(rect);

            col++;
        }

        row++;
    }

    updateViewBox(shape, svg);
};

const updateIsoBox = function (shape, svg)
{
    const w = shape.width;
    const h = shape.height;
    const proj = shape.projection;

    const topY = Math.floor(w / proj);
    const sideW = Math.floor(w / 2);

    //  sideBottom is where the bottom edge of the left/right faces sit.
    //  The top face diamond ends at topY * 2, and the side faces are h pixels tall.
    const sideBottom = topY * 2 + h;

    //  Total SVG height: top face peak (topY) + side face height (h) + bottom projection (topY)
    const totalH = topY + h + topY;

    const { topFace, leftFace, rightFace } = shape.elements;

    //  Top face diamond
    const topPoints =
        `${sideW},0 ${w},${topY} ${sideW},${topY * 2} 0,${topY}`;
    topFace.setAttribute('points', topPoints);
    topFace.setAttribute('fill', toSVGColor(shape.fillTop));
    topFace.setAttribute('display', shape.showTop ? '' : 'none');

    //  Left face
    const leftPoints =
        `0,${topY} ${sideW},${topY * 2} ${sideW},${sideBottom} 0,${sideBottom - topY}`;
    leftFace.setAttribute('points', leftPoints);
    leftFace.setAttribute('fill', toSVGColor(shape.fillLeft));
    leftFace.setAttribute('display', shape.showLeft ? '' : 'none');

    //  Right face
    const rightPoints =
        `${sideW},${topY * 2} ${w},${topY} ${w},${sideBottom - topY} ${sideW},${sideBottom}`;
    rightFace.setAttribute('points', rightPoints);
    rightFace.setAttribute('fill', toSVGColor(shape.fillRight));
    rightFace.setAttribute('display', shape.showRight ? '' : 'none');

    svg.setAttribute('viewBox', `0 0 ${w} ${totalH}`);
    svg.setAttribute('width', w);
    svg.setAttribute('height', totalH);
};

const updateIsoTriangle = function (shape, svg)
{
    const w = shape.width;
    const h = shape.height;
    const proj = shape.projection;
    const reversed = shape.isReversed;

    const sideW = Math.floor(w / 2);
    const topY = Math.floor(w / proj);

    const { topFace, leftFace, rightFace } = shape.elements;

    if (reversed)
    {
        //  Top face (flat base at top, point downward)
        topFace.setAttribute('points',
            `${0 },${ topY } ${
                w },${ topY } ${
                sideW },${ topY * 2}`);
        topFace.setAttribute('display', shape.showTop ? '' : 'none');

        //  Left face
        leftFace.setAttribute('points',
            `${0 },${ topY } ${
                sideW },${ topY * 2 } ${
                sideW },${ h}`);
        leftFace.setAttribute('display', shape.showLeft ? '' : 'none');

        //  Right face
        rightFace.setAttribute('points',
            `${sideW },${ topY * 2 } ${
                w },${ topY } ${
                sideW },${ h}`);
        rightFace.setAttribute('display', shape.showRight ? '' : 'none');
    }
    else
    {
        //  Top face (point at top)
        topFace.setAttribute('points',
            `${sideW },${ 0 } ${
                w },${ topY } ${
                0 },${ topY}`);
        topFace.setAttribute('display', shape.showTop ? '' : 'none');

        //  Left face
        leftFace.setAttribute('points',
            `${0 },${ topY } ${
                sideW },${ 0 } ${
                sideW },${ h}`);
        leftFace.setAttribute('display', shape.showLeft ? '' : 'none');

        //  Right face
        rightFace.setAttribute('points',
            `${sideW },${ 0 } ${
                w },${ topY } ${
                sideW },${ h}`);
        rightFace.setAttribute('display', shape.showRight ? '' : 'none');
    }

    topFace.setAttribute('fill', toSVGColor(shape.fillTop));
    leftFace.setAttribute('fill', toSVGColor(shape.fillLeft));
    rightFace.setAttribute('fill', toSVGColor(shape.fillRight));

    updateViewBox(shape, svg);
};

const updateLine = function (shape, svg)
{
    const el = svg.elements.Line;
    const {geom} = shape;

    el.setAttribute('x1', geom.x1);
    el.setAttribute('y1', geom.y1);
    el.setAttribute('x2', geom.x2);
    el.setAttribute('y2', geom.y2);

    el.setAttribute('stroke', shape.isStroked ? toSVGColor(shape.strokeColor) : 'none');
    el.setAttribute('stroke-opacity', shape.strokeAlpha);
    el.setAttribute('stroke-width', shape._startWidth);

    updateViewBox(shape, svg);
};

/**
 * Shared updater for Triangle, Polygon, and Star — all store their
 * final vertex data in shape.pathData as a flat [x0,y0, x1,y1, ...] array.
 *
 * @param {Phaser.GameObjects.Shape} shape
 * @param {SVGSVGElement} svg
 */
const updatePathDataShape = function (shape, svg)
{
    const el = shape.elements.Shape;
    const path = shape.pathData;

    if (!path || path.length < 4)
    {
        return;
    }

    let points = '';

    for (let i = 0; i < path.length - 1; i += 2)
    {
        points += `${path[i] },${ path[i + 1] } `;
    }

    el.setAttribute('points', points.trim());
    updateViewBox(shape, svg);
    updateStyle(shape, el);
};

const updateRectangle = function (shape, svg)
{
    const el = shape.elements.Rectangle;
    const w = shape.width;
    const h = shape.height;

    el.setAttribute('x', 0);
    el.setAttribute('y', 0);
    el.setAttribute('width', w);
    el.setAttribute('height', h);

    if (shape.isRounded)
    {
        el.setAttribute('rx', shape.radius);
        el.setAttribute('ry', shape.radius);
    }
    else
    {
        el.removeAttribute('rx');
        el.removeAttribute('ry');
    }

    updateViewBox(shape, svg);
    updateStyle(shape, el);
};

/**
 * Updates an SVG element to reflect the current state of a Phaser Shape
 * game object. Call this each frame (or on dirty) from the CSS renderer.
 *
 * @function SVGShapeUpdater
 * @since 5.0.0
 *
 * @param {Phaser.GameObjects.Shape} shape - The Phaser Shape game object.
 * @param {SVGSVGElement} svg - The SVG element created by SVGShapeFactory.
 */
const UpdateSVGShape = function (shape, svg)
{
    switch (shape.type)
    {
        case 'Arc': updatePathDataShape(shape, svg); break;
        case 'Circle': updateCircle(shape, svg); break;
        case 'Curve': updateCurve(shape, svg); break;
        case 'Ellipse': updateEllipse(shape, svg); break;
        case 'Grid': updateGrid(shape, svg); break;
        case 'IsoBox': updateIsoBox(shape, svg); break;
        case 'IsoTriangle': updateIsoTriangle(shape, svg); break;
        case 'Line': updateLine(shape, svg); break;
        case 'Polygon': updatePathDataShape(shape, svg); break;
        case 'Rectangle': updateRectangle(shape, svg); break;
        case 'Star': updatePathDataShape(shape, svg); break;
        case 'Triangle': updatePathDataShape(shape, svg); break;
    }
};

module.exports = UpdateSVGShape;
