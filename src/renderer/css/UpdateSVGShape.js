let gridPatternCounter = 0;


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

const updateGridCell = function (cell, x, y, cellWidth, cellHeight, cellPadding, fillColor, fillAlpha, strokeColor, strokeAlpha, lineWidth)
{
    cell.setAttribute('x', x + cellPadding);
    cell.setAttribute('y', y + cellPadding);
    cell.setAttribute('width', cellWidth - cellPadding * 2);
    cell.setAttribute('height', cellHeight - cellPadding * 2);
    cell.setAttribute('stroke', strokeColor);
    cell.setAttribute('stroke-opacity', strokeAlpha);
    cell.setAttribute('stroke-width', lineWidth);
    cell.setAttribute('fill', fillColor);
    cell.setAttribute('fill-opacity', fillAlpha);
};

const updateGrid = function (shape, svg)
{
    const totalWidth = shape.width;
    const totalHeight = shape.height;
    const { cellWidth, cellHeight, cellPadding, lineWidth, elements, strokeOutside } = shape;

    const fillColor = shape.isFilled ? toSVGColor(shape.fillColor) : 'none';
    const fillAlpha = shape.isFilled ? shape.fillAlpha : 1;
    const altFillColor = shape.showAltCells ? toSVGColor(shape.altFillColor) : fillColor;
    const altFillAlpha = shape.showAltCells ? shape.altFillAlpha : fillAlpha;

    const strokeColor = shape.isStroked ? toSVGColor(shape.strokeColor) : 'none';
    const strokeAlpha = shape.isStroked ? shape.strokeAlpha : 1;

    const grid = elements.Grid;
    const { cell1, cell2, cell3, cell4, pattern } = elements;

    grid.setAttribute('width', totalWidth);
    grid.setAttribute('height', totalHeight);
    grid.setAttribute('stroke', strokeOutside ? strokeColor : 'none');
    grid.setAttribute('stroke-opacity', strokeOutside ? strokeAlpha : 1);
    grid.setAttribute('stroke-width', strokeOutside ? lineWidth : 0);

    pattern.setAttribute('width', cellWidth * 2);
    pattern.setAttribute('height', cellHeight * 2);

    if (!pattern.id)
    {
        const patternId = `grid-pattern-${ gridPatternCounter++ }`;

        pattern.setAttribute('id', patternId);
        grid.setAttribute('fill', `url(#${ patternId })`);
    }

    updateGridCell(cell1, 0, 0, cellWidth, cellHeight, cellPadding, fillColor, fillAlpha, strokeColor, strokeAlpha, lineWidth);
    updateGridCell(cell2, cellWidth, 0, cellWidth, cellHeight, cellPadding, altFillColor, altFillAlpha, strokeColor, strokeAlpha, lineWidth);
    updateGridCell(cell3, 0, cellHeight, cellWidth, cellHeight, cellPadding, altFillColor, altFillAlpha, strokeColor, strokeAlpha, lineWidth);
    updateGridCell(cell4, cellWidth, cellHeight, cellWidth, cellHeight, cellPadding, fillColor, fillAlpha, strokeColor, strokeAlpha, lineWidth);

    updateViewBox(shape, svg);
};

const updateBoxFace = function (face, x1, y1, x2, y2, x3, y3, x4, y4, fill, visible)
{
    const points = `${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`;

    face.setAttribute('points', points);
    face.setAttribute('fill', fill);
    face.setAttribute('display', visible ? '' : 'none');
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

    updateBoxFace(topFace, sideW, 0, w, topY, sideW, topY * 2, 0, topY, toSVGColor(shape.fillTop), shape.showTop);
    updateBoxFace(leftFace, 0, topY, sideW, topY * 2, sideW, sideBottom, 0, sideBottom - topY, toSVGColor(shape.fillLeft), shape.showLeft);
    updateBoxFace(rightFace, sideW, topY * 2, w, topY, w, sideBottom - topY, sideW, sideBottom, toSVGColor(shape.fillRight), shape.showRight);

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
        //  Total SVG height: top projection + side height + bottom projection
        const totalH = topY * 2 + h;

        //  Top face: 4-point isometric rhombus (not a triangle)
        topFace.setAttribute('points',
            `0,0 ${sideW},${-topY} ${w},0 ${sideW},${topY}`);
        topFace.setAttribute('display', shape.showTop ? '' : 'none');

        //  Left face
        leftFace.setAttribute('points',
            `0,0 ${sideW},${totalH - topY} ${sideW},${topY}`);
        leftFace.setAttribute('display', shape.showLeft ? '' : 'none');

        //  Right face
        rightFace.setAttribute('points',
            `${w},0 ${sideW},${totalH - topY} ${sideW},${topY}`);
        rightFace.setAttribute('display', shape.showRight ? '' : 'none');

        svg.setAttribute('viewBox', `0 0 ${w} ${totalH}`);
        svg.setAttribute('width', w);
        svg.setAttribute('height', totalH);
    }
    else
    {
        //  Non-reversed (pyramid): peak is a single point — no top face
        topFace.setAttribute('display', 'none');

        //  Left face
        leftFace.setAttribute('points',
            `0,${h} ${sideW},${h + topY} ${sideW},${topY}`);
        leftFace.setAttribute('display', shape.showLeft ? '' : 'none');

        //  Right face
        rightFace.setAttribute('points',
            `${w},${h} ${sideW},${h + topY} ${sideW},${topY}`);
        rightFace.setAttribute('display', shape.showRight ? '' : 'none');

        updateViewBox(shape, svg);
    }

    topFace.setAttribute('fill', toSVGColor(shape.fillTop));
    leftFace.setAttribute('fill', toSVGColor(shape.fillLeft));
    rightFace.setAttribute('fill', toSVGColor(shape.fillRight));
};

const updateLine = function (shape, svg)
{
    const el = shape.elements.Line;
    const { geom } = shape;

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

    console.count(`UpdateSVGShape: ${shape.type}`);
};

module.exports = UpdateSVGShape;
