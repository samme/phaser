/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ArcadeSprite = require('./ArcadeSprite');
var Class = require('../../utils/Class');
var CONST = require('./const');
var GetFastValue = require('../../utils/object/GetFastValue');
var Group = require('../../gameobjects/group/Group');
var IsPlainObject = require('../../utils/object/IsPlainObject');

/**
 * @classdesc
 * An Arcade Physics Group object.
 *
 * The primary use of a Physics Group is a way to collect together physics enable objects
 * that share the same intrinsic structure into a single pool. They can they be easily
 * compared against other Groups, or Game Objects.
 *
 * All Game Objects created by, or added to this Group will automatically be given **dynamic**
 * Arcade Physics bodies (if they have no body already) and the bodies will receive the
 * Groups {@link Phaser.Physics.Arcade.Group#defaults default values}.
 *
 * You should not pass objects into this Group that should not receive a body. For example,
 * do not add basic Geometry or Tilemap Layers into a Group, as they will not behave in the
 * way you may expect. Groups should all ideally have objects of the same type in them.
 *
 * If you wish to create a Group filled with Static Bodies, please see {@link Phaser.Physics.Arcade.StaticGroup}.
 *
 * @class Group
 * @extends Phaser.GameObjects.Group
 * @memberof Phaser.Physics.Arcade
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.World} world - The physics simulation.
 * @param {Phaser.Scene} scene - The scene this group belongs to.
 * @param {(Phaser.GameObjects.GameObject[]|Phaser.Types.Physics.Arcade.PhysicsGroupConfig|Phaser.Types.GameObjects.Group.GroupCreateConfig)} [children] - Game Objects to add to this group; or the `config` argument.
 * @param {Phaser.Types.Physics.Arcade.PhysicsGroupConfig|Phaser.Types.GameObjects.Group.GroupCreateConfig} [config] - Settings for this group.
 */
var PhysicsGroup = new Class({

    Extends: Group,

    initialize:

    function PhysicsGroup (world, scene, children, config)
    {
        if (!children && !config)
        {
            config = {
                internalCreateCallback: this.createCallbackHandler,
                internalRemoveCallback: this.removeCallbackHandler
            };
        }
        else if (IsPlainObject(children))
        {
            //  children is a plain object, so swizzle them:
            config = children;
            children = null;

            config.internalCreateCallback = this.createCallbackHandler;
            config.internalRemoveCallback = this.removeCallbackHandler;
        }
        else if (Array.isArray(children) && IsPlainObject(children[0]))
        {
            //  children is an array of plain objects (i.e., configs)
            config = children[0];

            var _this = this;

            children.forEach(function (singleConfig)
            {
                singleConfig.internalCreateCallback = _this.createCallbackHandler;
                singleConfig.internalRemoveCallback = _this.removeCallbackHandler;
            });

            children = null;
        }
        else
        {
            // config is not defined and children is not a plain object nor an array of plain objects
            config = {
                internalCreateCallback: this.createCallbackHandler,
                internalRemoveCallback: this.removeCallbackHandler
            };
        }

        /**
         * The physics simulation.
         *
         * @name Phaser.Physics.Arcade.Group#world
         * @type {Phaser.Physics.Arcade.World}
         * @since 3.0.0
         */
        this.world = world;

        /**
         * The class to create new Group members from.
         *
         * This should be either `Phaser.Physics.Arcade.Image`, `Phaser.Physics.Arcade.Sprite`, or a class extending one of those.
         *
         * @name Phaser.Physics.Arcade.Group#classType
         * @type {Function}
         * @default ArcadeSprite
         * @since 3.0.0
         */
        config.classType = GetFastValue(config, 'classType', ArcadeSprite);

        /**
         * The physics type of the Group's members.
         *
         * @name Phaser.Physics.Arcade.Group#physicsType
         * @type {integer}
         * @default Phaser.Physics.Arcade.DYNAMIC_BODY
         * @since 3.0.0
         */
        this.physicsType = CONST.DYNAMIC_BODY;

        /**
         * Default physics properties applied to Game Objects added to the Group or created by the Group. Derived from the `config` argument.
         *
         * You can remove the default values by setting this property to `{}`.
         *
         * @name Phaser.Physics.Arcade.Group#defaults
         * @type {Phaser.Types.Physics.Arcade.PhysicsGroupDefaults}
         * @since 3.0.0
         */
        this.defaults = {
            setCollideWorldBounds: GetFastValue(config, 'collideWorldBounds', undefined),
            setBoundsRectangle: GetFastValue(config, 'customBoundsRectangle', undefined),
            setAccelerationX: GetFastValue(config, 'accelerationX', undefined),
            setAccelerationY: GetFastValue(config, 'accelerationY', undefined),
            setAllowDrag: GetFastValue(config, 'allowDrag', undefined),
            setAllowGravity: GetFastValue(config, 'allowGravity', undefined),
            setAllowRotation: GetFastValue(config, 'allowRotation', undefined),
            setBounceX: GetFastValue(config, 'bounceX', undefined),
            setBounceY: GetFastValue(config, 'bounceY', undefined),
            setDragX: GetFastValue(config, 'dragX', undefined),
            setDragY: GetFastValue(config, 'dragY', undefined),
            setEnable: GetFastValue(config, 'enable', undefined),
            setGravityX: GetFastValue(config, 'gravityX', undefined),
            setGravityY: GetFastValue(config, 'gravityY', undefined),
            setFrictionX: GetFastValue(config, 'frictionX', undefined),
            setFrictionY: GetFastValue(config, 'frictionY', undefined),
            setMaxVelocityX: GetFastValue(config, 'maxVelocityX', undefined),
            setMaxVelocityY: GetFastValue(config, 'maxVelocityY', undefined),
            setVelocityX: GetFastValue(config, 'velocityX', undefined),
            setVelocityY: GetFastValue(config, 'velocityY', undefined),
            setAngularVelocity: GetFastValue(config, 'angularVelocity', undefined),
            setAngularAcceleration: GetFastValue(config, 'angularAcceleration', undefined),
            setAngularDrag: GetFastValue(config, 'angularDrag', undefined),
            setMass: GetFastValue(config, 'mass', undefined),
            setImmovable: GetFastValue(config, 'immovable', undefined)
        };

        Group.call(this, scene, children, config);

        /**
         * A textual representation of this Game Object.
         * Used internally by Phaser but is available for your own custom classes to populate.
         *
         * @name Phaser.Physics.Arcade.Group#type
         * @type {string}
         * @default 'PhysicsGroup'
         * @since 3.21.0
         */
        this.type = 'PhysicsGroup';
    },

    /**
     * Enables a Game Object's Body and assigns `defaults`. Called when a Group member is added or created.
     *
     * @method Phaser.Physics.Arcade.Group#createCallbackHandler
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - The Game Object being added.
     */
    createCallbackHandler: function (child)
    {
        if (!child.body)
        {
            this.world.enableBody(child, CONST.DYNAMIC_BODY);
        }

        var body = child.body;

        for (var key in this.defaults)
        {
            var val = this.defaults[key];

            if (val !== undefined)
            {
                body[key](val);
            }
        }
    },

    /**
     * Disables a Game Object's Body. Called when a Group member is removed.
     *
     * @method Phaser.Physics.Arcade.Group#removeCallbackHandler
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - The Game Object being removed.
     */
    removeCallbackHandler: function (child)
    {
        if (child.body)
        {
            this.world.disableBody(child);
        }
    },

    /**
     * Sets the velocity of each Group member.
     *
     * @method Phaser.Physics.Arcade.Group#setVelocity
     * @since 3.0.0
     *
     * @param {number} x - The horizontal velocity.
     * @param {number} y - The vertical velocity.
     * @param {number} [step=0] - The velocity increment. When set, the first member receives velocity (x, y), the second (x + step, y + step), and so on.
     *
     * @return {Phaser.Physics.Arcade.Group} This Physics Group object.
     */
    setVelocity: function (x, y, step)
    {
        if (step === undefined) { step = 0; }

        var items = this.getChildren();

        for (var i = 0; i < items.length; i++)
        {
            items[i].body.velocity.set(x + (i * step), y + (i * step));
        }

        return this;
    },

    /**
     * Sets the horizontal velocity of each Group member.
     *
     * @method Phaser.Physics.Arcade.Group#setVelocityX
     * @since 3.0.0
     *
     * @param {number} value - The velocity value.
     * @param {number} [step=0] - The velocity increment. When set, the first member receives velocity (x), the second (x + step), and so on.
     *
     * @return {Phaser.Physics.Arcade.Group} This Physics Group object.
     */
    setVelocityX: function (value, step)
    {
        if (step === undefined) { step = 0; }

        var items = this.getChildren();

        for (var i = 0; i < items.length; i++)
        {
            items[i].body.velocity.x = value + (i * step);
        }

        return this;
    },

    /**
     * Sets the vertical velocity of each Group member.
     *
     * @method Phaser.Physics.Arcade.Group#setVelocityY
     * @since 3.0.0
     *
     * @param {number} value - The velocity value.
     * @param {number} [step=0] - The velocity increment. When set, the first member receives velocity (y), the second (y + step), and so on.
     *
     * @return {Phaser.Physics.Arcade.Group} This Physics Group object.
     */
    setVelocityY: function (value, step)
    {
        if (step === undefined) { step = 0; }

        var items = this.getChildren();

        for (var i = 0; i < items.length; i++)
        {
            items[i].body.velocity.y = value + (i * step);
        }

        return this;
    }

});

module.exports = PhysicsGroup;
