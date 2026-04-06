
var CanvasImageRender = require('./CanvasImageRender');
var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var UUID = require('../../utils/string/UUID');

var CanvasImage = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Depth,
        Components.Flip,
        Components.GetBounds,
        Components.Mask,
        Components.Origin,
        Components.ScrollFactor,
        Components.Size,
        Components.TextureCrop,
        Components.Tint,
        Components.Transform,
        Components.Visible,
        CanvasImageRender
    ],

    initialize:

    function CanvasImage (scene, x, y, width, height)
    {
        GameObject.call(this, scene, 'CanvasImage');

        this.dirty = false;

        var texture = scene.sys.textures.createCanvas(UUID(), width, height);

        this._crop = this.resetCropObject();

        this.setTexture(texture);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOriginFromFrame();
    },

    setTexture: function (key, frame, updateSize, updateOrigin)
    {
        this.texture = this.scene.sys.textures.get(key);

        this.dirty = true;

        return this.setFrame(frame, updateSize, updateOrigin);
    },

    preDestroy: function ()
    {
        this.texture.destroy();
    }

});

module.exports = CanvasImage;
