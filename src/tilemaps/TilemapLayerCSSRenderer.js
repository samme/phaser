const RenderFilters = require('../renderer/css/RenderFilters');
const RenderMask = require('../renderer/css/RenderMask');
const RenderTransformWithSize = require('../renderer/css/RenderTransformWithSize');

/**
 * Renders this Game Object with the CSS Renderer.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.Tilemaps.TilemapLayer#renderCSS
 * @since 5.0.0
 * @private
 *
 * @param {Phaser.Renderer.CSS.CSSRenderer} renderer - A reference to the current active CSS renderer.
 * @param {Phaser.Tilemaps.TilemapLayer} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 */
var TilemapLayerCSSRenderer = function (renderer, src, camera)
{
    var { renderNode } = src;

    if (!src.willRenderCSS())
    {
        renderNode.hide();
        return;
    }

    camera.addToRenderList(src);

    renderNode.show();
    renderNode.setAlpha(src.alpha);
    renderNode.setBlendMode(src.blendMode);

    RenderFilters(src);
    RenderMask(src);
    RenderTransformWithSize(src, camera);

    if (src.isFrozen)
    {
        if (src._frozenRendered) { return; }

        src._frozenRendered = true;
    }

    var gidMap = src.gidMap;
    var tileRenderNodes = src.tileRenderNodes;
    var tiles = src.cull(camera);
    var styleCount = 0;
    var visibleCount = 0;
    var srcElement = renderNode.element;

    for (var tile of tiles)
    {
        if (!tile)
        {
            continue;
        }

        styleCount++;

        var node = tileRenderNodes.get(tile);

        if (node)
        {
            renderer.countDirtyState(false, 1);
        }
        else
        {
            node = renderer.createRenderNode();

            tileRenderNodes.set(tile, node);

            srcElement.appendChild(node.element);

            renderer.mutateCount++;
            renderer.countDirtyState(true, 1);
        }

        if (tile.index === -1 || !tile.visible || tile.alpha <= 0)
        {
            node.hide();
            continue;
        }

        var tileset = gidMap[tile.index];

        if (!tileset)
        {
            node.hide();
            continue;
        }

        var tileTexCoords = tileset.getTileTextureCoordinates(tile.index);
        var tileWidth = tileset.tileWidth;
        var tileHeight = tileset.tileHeight;

        if (tileTexCoords === null || tileWidth === 0 || tileHeight === 0)
        {
            node.hide();
            continue;
        }

        visibleCount++;

        node.show();

        node.setSize(tileWidth, tileHeight);
        node.setAlpha(tile.alpha);
        node.setProperty('background', tileTexCoords.cssBackground);

        // top-left (pixelX, pixelY)
        var px = tile.pixelX;
        var py = tile.pixelY;

        if (tile.rotation !== 0 || tile.flipX || tile.flipY)
        {
            var scaleX = tile.flipX ? -1 : 1;
            var scaleY = tile.flipY ? -1 : 1;
            var halfWidth = tileWidth * 0.5;
            var halfHeight = tileHeight * 0.5;

            node.setTRS(px, py, tile.rotation, scaleX, scaleY);
            node.setTransformOrigin(halfWidth, halfHeight);
        }
        else
        {
            node.setXY(px, py);
            node.setTransformOrigin(null);
        }

    }

    src.tilesDrawn = visibleCount;

    renderer.drawCount += styleCount;
};

module.exports = TilemapLayerCSSRenderer;
