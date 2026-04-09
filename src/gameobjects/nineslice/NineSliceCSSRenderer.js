const RenderFilters = require('../../renderer/css/RenderFilters');
const RenderTransformWithSize = require('../../renderer/css/RenderTransformWithSize');
const RenderMask = require('../../renderer/css/RenderMask');

/**
 * Renders this Game Object with the CSS Renderer.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.NineSlice#renderCSS
 * @since 3.90.0
 * @private
 *
 * @param {Phaser.Renderer.CSS.CSSRenderer} renderer - A reference to the current active CSS renderer.
 * @param {Phaser.GameObjects.NineSlice} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera rendering the Game Object.
 */
var NineSliceCSSRenderer = function (renderer, src, camera)
{
    var renderNode = src.renderNode;

    camera.addToRenderList(src);

    if (src.willRenderCSS())
    {
        renderNode.show();
    }
    else
    {
        renderNode.hide();
        return;
    }

    // --- Transform ---

    RenderTransformWithSize(src, camera);

    // ---  Alpha / Blend ---

    renderNode.setAlpha(src.alpha);
    renderNode.setBlendMode(src.blendMode);

    // --- Nine Slice via CSS border-image ---

    var frame = src.frame;

    var leftWidth = src.leftWidth;
    var rightWidth = src.rightWidth;
    var topHeight = src.topHeight;
    var bottomHeight = src.bottomHeight;

    // border-image-source
    renderNode.setProperty('borderImageSource', frame.source.cssImage);

    // border-image-slice: top right bottom left [fill]
    // CSS border-image-slice uses pixel values for raster images when no '%' suffix is used.
    // The 'fill' keyword preserves the center region (area 5).
    var sliceValue;

    if (src.is3Slice)
    {
        // 3-slice: only left/right columns, no top/bottom rows.
        // Use 0 for top/bottom so only left and right borders are sliced.
        sliceValue = `0 ${rightWidth} 0 ${leftWidth} fill`;
    }
    else
    {
        sliceValue = `${topHeight} ${rightWidth} ${bottomHeight} ${leftWidth} fill`;
    }

    renderNode.setProperty('borderImageSlice', sliceValue);

    // border-image-width: how wide each border region renders on the element.
    // Must match the slice sizes in px to prevent scaling the corners.
    var borderWidthValue;

    if (src.is3Slice)
    {
        borderWidthValue = `0 ${rightWidth}px 0 ${leftWidth}px`;
    }
    else
    {
        borderWidthValue = `${topHeight}px ${rightWidth}px ${bottomHeight}px ${leftWidth}px`;
    }

    renderNode.setProperty('borderImageWidth', borderWidthValue);

    // Prevent the border from expanding the element's box
    renderNode.setProperty('boxSizing', 'border-box');

    // border-image-repeat: stretch is default; 'round' or 'repeat' could be
    // used for tiling but stretch matches the WebGL renderer's default behavior.

    renderNode.setProperty('borderImageRepeat', `${src.repeatX} ${src.repeatY}`);

    RenderFilters(src);
    RenderMask(src);
};

module.exports = NineSliceCSSRenderer;
