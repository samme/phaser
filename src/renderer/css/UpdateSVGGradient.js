const LINEAR = 0;

const RADIAL = 2;

/**
 * Maps Gradient repeatMode values to SVG spreadMethod values.
 *
 * - 0 (EXTEND):     'pad'
 * - 1 (TRUNCATE):   'pad'     (no SVG equivalent; pad is closest)
 * - 2 (SAWTOOTH):   'repeat'
 * - 3 (TRIANGULAR): 'reflect'
 *
 * @type {string[]}
 * @private
 */
const SPREAD_METHODS = [ 'pad', 'pad', 'repeat', 'reflect' ];

/**
 * Updates an SVG element created by `CreateSVGGradient` with data
 * from a Gradient Game Object.
 *
 * For linear gradients, updates the gradient vector from `gradient.start`
 * and `gradient.shape`.
 * For radial gradients, updates the center/focal point from `gradient.start`
 * and the radius from `gradient.shape.length()`.
 * Stop colors are rebuilt from the gradient's ramp bands on every call.
 * Gradient `offset` is not supported.
 *
 * Has no effect on unsupported gradient types.
 *
 * @function UpdateSVGGradient
 * @since 5.0.0
 *
 * @param {SVGSVGElement} svg - The SVG element to update.
 * @param {Phaser.GameObjects.Gradient} gradient - The Gradient Game Object to read data from.
 */
const UpdateSVGGradient = function (svg, gradient)
{
    const { shapeMode, width, height } = gradient;

    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);

    let gradientEl;

    // Update geometry attributes.
    if (shapeMode === LINEAR)
    {
        gradientEl = svg.querySelector('linearGradient');

        gradientEl.setAttribute('x1', gradient.start.x);
        gradientEl.setAttribute('y1', gradient.start.y);
        gradientEl.setAttribute('x2', gradient.start.x + gradient.shape.x);
        gradientEl.setAttribute('y2', gradient.start.y + gradient.shape.y);
    }
    else if (shapeMode === RADIAL)
    {
        gradientEl = svg.querySelector('radialGradient');

        const cx = gradient.start.x;
        const cy = gradient.start.y;
        const r = gradient.shape.length();

        gradientEl.setAttribute('cx', cx);
        gradientEl.setAttribute('cy', cy);
        gradientEl.setAttribute('fx', cx);
        gradientEl.setAttribute('fy', cy);
        gradientEl.setAttribute('r', r);
    }
    else
    {
        const rect = svg.querySelector('rect');

        rect.setAttribute('fill', gradient.ramp.bands[0].colorStart.rgb);

        return;
    }

    const spreadMethod = SPREAD_METHODS[gradient.repeatMode] || 'pad';

    gradientEl.setAttribute('spreadMethod', spreadMethod);

    gradientEl.setAttribute('gradientTransform', gradient.transform.getCSSMatrix());

    // Rebuild stops from ramp bands.
    const stops = [];
    const { bands } = gradient.ramp;
    const ns = 'http://www.w3.org/2000/svg';

    for (const band of bands)
    {
        const stopStart = svg.ownerDocument.createElementNS(ns, 'stop');
        stopStart.setAttribute('offset', band.start);
        stopStart.setAttribute('stop-color', band.colorStart.rgb);
        stopStart.setAttribute('stop-opacity', band.colorStart.alphaGL);

        stops.push(stopStart);

        const stopEnd = svg.ownerDocument.createElementNS(ns, 'stop');
        stopEnd.setAttribute('offset', band.end);
        stopEnd.setAttribute('stop-color', band.colorEnd.rgb);
        stopEnd.setAttribute('stop-opacity', band.colorEnd.alphaGL);

        stops.push(stopEnd);
    }

    gradientEl.replaceChildren(...stops);
};

module.exports = UpdateSVGGradient;
