/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');

/**
 * @classdesc
 * A Geometry Mask can be applied to a Game Object to hide any pixels of it which don't intersect
 * a visible pixel from the geometry mask. The mask is essentially a clipping path which can only
 * make a masked pixel fully visible or fully invisible without changing its alpha (opacity).
 *
 * Pass either `shape` or `clipPath`.
 *
 * @class GeometryMask
 * @memberof Phaser.Display.Masks
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - This parameter is not used.
 * @param {(Phaser.Geom.Circle|Phaser.Geom.Ellipse|Phaser.Geom.Polygon|Phaser.Geom.Rectangle|Phaser.Geom.Triangle)} [shape] - A Phaser geometry shape.
 * @param {string} [clipPath] - A CSS `clip-path` value. If provided, the shape parameter is ignored.
 */
var GeometryMask = new Class({

    initialize:

    function GeometryMask (scene, shape = null, clipPath = null)
    {
        if (!shape && !clipPath)
        {
            throw new Error('GeometryMask requires either a shape or a clipPath');
        }

        this.shape = shape;

        this.clipPath = clipPath;

        this.name = 'clip-path';
    },

    getCSSValue: function ()
    {
        return this.clipPath || this.shape.getCSSClipPath();
    },

    destroy: function ()
    {
        this.shape = null;
        this.clipPath = null;
    }

});

module.exports = GeometryMask;
