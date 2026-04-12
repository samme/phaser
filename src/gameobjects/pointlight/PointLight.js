/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var IntegerToColor = require('../../display/color/IntegerToColor');
var Render = require('./PointLightRender');
var SmoothStep = require('../../math/SmoothStep');

/**
 * @classdesc
 * The Point Light Game Object provides a way to add a point light effect into your game,
 * without the expensive shader processing requirements of the traditional Light Game Object.
 *
 * The origin of a Point Light is always 0.5 and it cannot be changed.
 *
 * Point Lights do not have a Canvas counterpart.
 *
 * @class PointLight
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.50.0
 *
 * @extends Phaser.GameObjects.Components.AlphaSingle
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.RenderNodes
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Point Light belongs. A Point Light can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Point Light in the world.
 * @param {number} y - The vertical position of this Point Light in the world.
 * @param {number} [color=0xffffff] - The color of the Point Light, given as a hex value.
 * @param {number} [radius=128] - The radius of the Point Light.
 * @param {number} [intensity=1] - The intensity, or color blend, of the Point Light.
 * @param {number} [attenuation=0.1] - The attenuation of the Point Light. This is the reduction of light from the center point.
 */
var PointLight = new Class({

    Extends: GameObject,

    Mixins: [
        Components.AlphaSingle,
        Components.BlendMode,
        Components.Depth,
        Components.Mask,
        Components.RenderNodes,
        Components.ScrollFactor,
        Components.Transform,
        Components.Visible,
        Render
    ],

    initialize:

    function PointLight (scene, x, y, color, radius, intensity, attenuation)
    {
        if (color === undefined) { color = 0xffffff; }
        if (radius === undefined) { radius = 128; }
        if (intensity === undefined) { intensity = 1; }
        if (attenuation === undefined) { attenuation = 0.1; }

        GameObject.call(this, scene, 'PointLight');

        this.initRenderNodes(this._defaultRenderNodesMap);

        this.setPosition(x, y);

        /**
         * The color of this Point Light. This property is an instance of a
         * Color object, so you can use the methods within it, such as `setTo(r, g, b)`
         * to change the color value.
         *
         * @name Phaser.GameObjects.PointLight#color
         * @type {Phaser.Display.Color}
         * @since 3.50.0
         */
        this.color = IntegerToColor(color);

        /**
         * The intensity of the Point Light.
         *
         * The colors of the light are multiplied by this value during rendering.
         *
         * @name Phaser.GameObjects.PointLight#intensity
         * @type {number}
         * @since 3.50.0
         */
        this.intensity = intensity;

        /**
         * The attenuation of the Point Light.
         *
         * This value controls the force with which the light falls-off from the center of the light.
         *
         * Use small float-based values, i.e. 0.1.
         *
         * @name Phaser.GameObjects.PointLight#attenuation
         * @type {number}
         * @since 3.50.0
         */
        this.attenuation = attenuation;

        //  read only:
        this.width = radius * 2;
        this.height = radius * 2;

        this._radius = radius;
    },

    /**
     * The radius of the Point Light, in pixels. Changing this value also updates
     * the `width` and `height` properties of this Game Object to `radius * 2`.
     *
     * @name Phaser.GameObjects.PointLight#radius
     * @type {number}
     * @since 3.50.0
     */
    radius: {

        get: function ()
        {
            return this._radius;
        },

        set: function (value)
        {
            this._radius = value;
            this.width = value * 2;
            this.height = value * 2;
        }

    },

    /**
     * The horizontal origin of this Point Light. This is always fixed at 0.5 and cannot be changed.
     *
     * @name Phaser.GameObjects.PointLight#originX
     * @type {number}
     * @readonly
     * @since 3.50.0
     */
    originX: {

        get: function ()
        {
            return 0.5;
        }

    },

    /**
     * The vertical origin of this Point Light. This is always fixed at 0.5 and cannot be changed.
     *
     * @name Phaser.GameObjects.PointLight#originY
     * @type {number}
     * @readonly
     * @since 3.50.0
     */
    originY: {

        get: function ()
        {
            return 0.5;
        }

    },

    /**
     * The horizontal display origin of this Point Light, in pixels. This is equal to the radius of the light.
     *
     * @name Phaser.GameObjects.PointLight#displayOriginX
     * @type {number}
     * @readonly
     * @since 3.50.0
     */
    displayOriginX: {

        get: function ()
        {
            return this._radius;
        }

    },

    /**
     * The vertical display origin of this Point Light, in pixels. This is equal to the radius of the light.
     *
     * @name Phaser.GameObjects.PointLight#displayOriginY
     * @type {number}
     * @readonly
     * @since 3.50.0
     */
    displayOriginY: {

        get: function ()
        {
            return this._radius;
        }

    },

    getCSSBackground: function ()
    {
        var color = this.color;
        var attenuation = this.attenuation;
        var intensity = this.intensity;

        // Sample the shader's smoothstep falloff at 5 points across the radius.
        // shader: radius = 1.0 - dist / lightRadius
        //         intensity = smoothstep(0.0, 1.0, radius * attenuation)
        var stops = [];
        var numStops = 5;

        for (var i = 0; i < numStops; i++)
        {
            var t = i / (numStops - 1); // 0, 0.25, 0.5, 0.75, 1.0

            // Shader radius value at this distance
            var r = 1 - t;

            // Shader smoothstep intensity
            var si = SmoothStep(r * attenuation, 0, 1);

            // Scale si by the light intensity for color brightness
            var lightIntensity = si * intensity * 255;

            var red = Math.min(255, Math.round(color.r * lightIntensity));
            var green = Math.min(255, Math.round(color.g * lightIntensity));
            var blue = Math.min(255, Math.round(color.b * lightIntensity));
            var alpha = si * this.alpha * 255;

            stops.push('rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ') ' + (t * 100) + '%');
        }

        var grad = 'radial-gradient(circle closest-side at center, ' + stops.join(', ') + ')';

        return grad;
    }

});

module.exports = PointLight;
