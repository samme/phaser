/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Global constants.
 *
 * @ignore
 */

var CONST = {

    /**
     * Phaser Release Version
     *
     * @name Phaser.VERSION
     * @const
     * @type {string}
     * @since 3.0.0
     */
    VERSION: '4.0.0',

    /**
     * Phaser Release Version as displayed in the console.log header URL.
     *
     * @name Phaser.LOG_VERSION
     * @const
     * @type {string}
     * @since 3.87.0
     */
    LOG_VERSION: 'v400 👽 CSS Renderer',

    BlendModes: require('./renderer/BlendModes'),

    ScaleModes: require('./renderer/ScaleModes'),

    /**
     * AUTO is the CSS Renderer.
     *
     * @name Phaser.AUTO
     * @const
     * @type {number}
     * @since 3.0.0
     */
    AUTO: 0,

    /**
     * Forces Phaser to only use the Canvas Renderer.
     *
     * @name Phaser.CANVAS
     * @const
     * @type {number}
     * @since 3.0.0
     */
    CANVAS: 1,

    /**
     * The WebGL Renderer. Not used.
     *
     * @name Phaser.WEBGL
     * @const
     * @type {number}
     * @since 3.0.0
     */
    WEBGL: 2,

    /**
     * The Headless Renderer. Not used.
     *
     * @name Phaser.HEADLESS
     * @const
     * @type {number}
     * @since 3.0.0
     */
    HEADLESS: 3,


    CSS: 4,

    /**
     * In Phaser the value -1 means 'forever' in lots of cases, this const allows you to use it instead
     * to help you remember what the value is doing in your code.
     *
     * @name Phaser.FOREVER
     * @const
     * @type {number}
     * @since 3.0.0
     */
    FOREVER: -1,

    /**
     * Direction constant representing no direction, or an unset direction. Used in various
     * Phaser systems such as physics and input where a direction value is required but none applies.
     *
     * @name Phaser.NONE
     * @const
     * @type {number}
     * @since 3.0.0
     */
    NONE: 4,

    /**
     * Direction constant representing upward movement or orientation. Used in physics,
     * tilemaps, and other Phaser systems that work with cardinal directions.
     *
     * @name Phaser.UP
     * @const
     * @type {number}
     * @since 3.0.0
     */
    UP: 5,

    /**
     * Direction constant representing downward movement or orientation. Used in physics,
     * tilemaps, and other Phaser systems that work with cardinal directions.
     *
     * @name Phaser.DOWN
     * @const
     * @type {number}
     * @since 3.0.0
     */
    DOWN: 6,

    /**
     * Direction constant representing leftward movement or orientation. Used in physics,
     * tilemaps, and other Phaser systems that work with cardinal directions.
     *
     * @name Phaser.LEFT
     * @const
     * @type {number}
     * @since 3.0.0
     */
    LEFT: 7,

    /**
     * Direction constant representing rightward movement or orientation. Used in physics,
     * tilemaps, and other Phaser systems that work with cardinal directions.
     *
     * @name Phaser.RIGHT
     * @const
     * @type {number}
     * @since 3.0.0
     */
    RIGHT: 8

};

module.exports = CONST;
