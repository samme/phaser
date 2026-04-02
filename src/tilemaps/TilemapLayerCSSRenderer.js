/**
 * Renders this Game Object with the CSS Renderer.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.Tilemaps.TilemapLayer#renderCSS
 * @since 4.0.0
 * @private
 *
 * @param {Phaser.Renderer.CSS.CSSRenderer} renderer - A reference to the current active CSS renderer.
 * @param {Phaser.Tilemaps.TilemapLayer} src - The Game Object being rendered in this call.
 */
var TilemapLayerCSSRenderer = function (renderer, src, camera)
{
    if (!src.willRenderCSS())
    {
        src.renderNode.hide();
        return;
    }

    src.renderNode.show();

    src.renderNode.setAlpha(src.alpha);
    src.renderNode.setBlendMode(src.blendMode);
    src.renderNode.setSize(src.width, src.height);
    src.renderNode.setTSR(src.x, src.y, src.scaleX, src.scaleY, src.rotation);

    if (src.isFrozen)
    {
        if (src._frozenRendered) { return; }

        src._frozenRendered = true;
    }

    var gidMap = src.gidMap;
    var tiles = src.cull(camera);
    var drawCount = 0;

    for (var tile of tiles)
    {
        if (!tile)
        {
            continue;
        }

        // We count all styled tiles, visible or not.
        drawCount++;

        var node = tile.renderNode;

        if (node)
        {
            renderer.countDirtyState(false, 1);
        }
        else
        {
            tile.scene = src.scene;
            tile.initRenderNode();
            node = tile.renderNode;
            renderer.appendChildToParentRenderNode(node, src.renderNode);
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

        node.show();

        node.setSize(tileWidth, tileHeight);
        node.setAlpha(tile.alpha);
        node.setProperty('background', tileTexCoords.cssBackground);

        var px = tile.pixelX;
        var py = tile.pixelY;
        var halfWidth = tileWidth * 0.5;
        var halfHeight = tileHeight * 0.5;

        if (tile.rotation !== 0 || tile.flipX || tile.flipY)
        {
            var scaleX = tile.flipX ? -1 : 1;
            var scaleY = tile.flipY ? -1 : 1;

            node.setTSR(px, py, scaleX, scaleY, tile.rotation);
            node.setTransformOrigin(halfWidth, halfHeight);
        }
        else
        {
            node.setXY(px, py);
            node.setTransformOrigin(null);
        }

    }

    src.tilesDrawn = drawCount;

    renderer.drawCount += drawCount;
};

module.exports = TilemapLayerCSSRenderer;
