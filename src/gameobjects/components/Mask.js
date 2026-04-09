/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for setting, clearing, and creating masks on a Game Object.
 *
 * A mask clips the rendered output of a Game Object to the shape defined by a Graphics
 * or Shape Game Object. Only pixels that fall within the mask geometry are drawn to the screen.
 * Masks have no effect on physics or input detection; they are purely a visual rendering tool.
 *
 * This component only works under the Canvas Renderer.
 * For WebGL, see {@link Phaser.GameObjects.Components.FilterList#addMask}.
 *
 * @namespace Phaser.GameObjects.Components.Mask
 * @since 3.0.0
 */

var Mask = {

    /**
     * The Mask this Game Object is using during render, or `null` if no mask has been set.
     *
     * @name Phaser.GameObjects.Components.Mask#mask
     * @type {Phaser.Display.Masks.GeometryMask}
     * @since 3.0.0
     */
    mask: null,

    /**
     * Sets the mask that this Game Object will use to render with.
     *
     * The mask must have been previously created and must be a GeometryMask.
     * This only works in the Canvas Renderer.
     * In WebGL, use a Mask filter instead (see {@link Phaser.GameObjects.Components.FilterList#addMask}).
     *
     * If a mask is already set on this Game Object it will be immediately replaced.
     *
     * Masks are positioned in global space and are not relative to the Game Object to which they
     * are applied. The reason for this is that multiple Game Objects can all share the same mask.
     *
     * Masks have no impact on physics or input detection. They are purely a rendering component
     * that allows you to limit what is visible during the render pass.
     *
     * @method Phaser.GameObjects.Components.Mask#setMask
     * @since 3.6.2
     *
     * @param {Phaser.Display.Masks.GeometryMask} mask - The mask this Game Object will use when rendering.
     *
     * @return {this} This Game Object instance.
     */
    setMask: function (mask)
    {
        this.mask = mask;

        return this;
    },

    /**
     * Clears the mask that this Game Object was using.
     *
     * This only works in the Canvas Renderer.
     * In WebGL, use a Mask filter instead (see {@link Phaser.GameObjects.Components.FilterList#addMask}).
     *
     * @method Phaser.GameObjects.Components.Mask#clearMask
     * @since 3.6.2
     *
     * @param {boolean} [destroyMask=false] - Destroy the mask before clearing it?
     *
     * @return {this} This Game Object instance.
     */
    clearMask: function (destroyMask)
    {
        if (destroyMask === undefined) { destroyMask = false; }

        if (destroyMask && this.mask)
        {
            this.mask.destroy();
        }

        this.mask = null;

        return this;
    }

};

module.exports = Mask;
