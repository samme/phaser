
/**
 * Renders this Game Object with the CSS Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Image#renderCSS
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.CSS.CSSRenderer} renderer - The CSS renderer.
 * @param {Phaser.GameObjects.Image} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var ImageCSSRenderer = function (renderer, src, camera, parentMatrix)
{
    if (!src.willRenderCSS())
    {
        src.renderNode.hide();

        return;
    }

    camera.addToRenderList(src);

    src.renderNode.show();

    renderer.batchSprite(src, src.frame, camera, parentMatrix);
};

module.exports = ImageCSSRenderer;
