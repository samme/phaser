var Class = require('../../../utils/Class');
var GeomCircle = require('../../../geom/circle/Circle');
var Shape = require('../Shape');

/**
 * @classdesc
 * The Circle Shape is a Game Object that can be added to a Scene, Group or Container. You can
 * treat it like any other Game Object in your game, such as tweening it, scaling it, or enabling
 * it for input or physics. It provides a quick and easy way for you to render this shape in your
 * game without using a texture.
 *
 * This shape supports both fill and stroke colors.
 *
 * @class Circle
 * @extends Phaser.GameObjects.Shape
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 5.0.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [radius=128] - The radius of the Circle.
 * @param {number} [fillColor] - The color the Circle will be filled with, i.e. 0xff0000 for red.
 * @param {number} [fillAlpha] - The alpha the Circle will be filled with. You can also set the alpha of the overall Shape using its `alpha` property.
 */
var Circle = new Class({

    Extends: Shape,

    initialize:

    function Circle (scene, x, y, radius, fillColor, fillAlpha)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (radius === undefined) { radius = 128; }

        Shape.call(this, scene, 'Circle', new GeomCircle(0, 0, radius));

        this.setPosition(x, y);

        var diameter = this.geom.radius * 2;
        this.setSize(diameter, diameter);

        if (fillColor !== undefined)
        {
            this.setFillStyle(fillColor, fillAlpha);
        }

        this.updateDisplayOrigin();
    },

    /**
     * The radius of the Circle.
     *
     * @name Phaser.GameObjects.Circle#radius
     * @type {number}
     * @since 3.13.0
     */
    radius: {

        get: function ()
        {
            return this.geom.radius;
        },

        set: function (value)
        {
            this.geom.radius = value;

            var diameter = value * 2;
            this.setSize(diameter, diameter);
            this.updateDisplayOrigin();
        }

    },

    /**
     * Sets the radius of the Circle.
     * This call can be chained.
     *
     * @method Phaser.GameObjects.Circle#setRadius
     * @since 3.13.0
     *
     * @param {number} value - The value to set the radius to.
     *
     * @return {this} This Game Object instance.
     */
    setRadius: function (value)
    {
        this.radius = value;

        return this;
    }

});

module.exports = Circle;
