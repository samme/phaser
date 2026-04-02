/**
 * Renders this Game Object with the CSS Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.TileSprite#renderCSS
 * @since 5.0.0
 * @private
 *
 * @param {Phaser.Renderer.CSS.CSSRenderer} renderer - A reference to the current active CSS renderer.
 * @param {Phaser.GameObjects.TileSprite} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 */
var TileSpriteCSSRenderer = function (renderer, src, camera)
{
    const {renderNode} = src;

    if (!src.willRenderCSS())
    {
        renderNode.hide();

        return;
    }

    // For now this is required for pointer input.
    camera.addToRenderList(src);

    renderNode.show();

    renderNode.setAlpha(src.alpha);
    renderNode.setBlendMode(src.blendMode);
    renderNode.setSize(src.width, src.height);
    renderNode.setTransformOrigin(src.displayOriginX, src.displayOriginY);
    renderNode.setTSR(src.x - src.displayOriginX, src.y - src.displayOriginY, src.scaleX, src.scaleY, src.rotation);

    // TODO: tints and filters

    if (src.dirty)
    {
        const frame = src.texture.get('__BASE');
        const backgroundUrl = `url('${frame.source.image.src}')`;
        const backgroundSize = `${frame.width * src.tileScaleX}px ${frame.height * src.tileScaleY}px`;
        const backgroundPosition = `${src.tilePositionX}px ${src.tilePositionY}px`;

        renderNode.setProperty('backgroundImage', backgroundUrl);
        renderNode.setProperty('backgroundSize', backgroundSize);
        renderNode.setProperty('backgroundPosition', backgroundPosition);
        renderNode.setProperty('backgroundRepeat', 'repeat');

        src.dirty = false;

        renderNode.element.dataset.texture = frame.texture.key;
        renderNode.element.dataset.frame = frame.name;
    }
};

module.exports = TileSpriteCSSRenderer;
