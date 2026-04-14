const Class = require('../../utils/Class');
const Components = require('../../gameobjects/components');

const BitmapMask = new Class({

    Mixins: [
        Components.Size,
        Components.Texture
    ],

    initialize:

    function BitmapMask (scene, x, y, texture, maskPosition = null, maskSize = null, repeat = 'no-repeat', mode = 'alpha')
    {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.scaleX = 1;
        this.scaleY = 1;

        this.setTexture(texture);

        this.maskPosition = maskPosition;
        this.maskSize = maskSize;
        this.repeat = repeat;
        this.mode = mode;

        this.name = 'mask';

        this.active = true;
    },

    getCSSValue: function ()
    {
        const maskPosition = this.maskPosition || `${this.x}px ${this.y}px`;
        const maskSize = this.maskSize || `${this.displayWidth}px ${this.displayHeight}px`;

        return `${this.frame.source.cssImage} ${maskPosition} / ${maskSize} ${this.repeat} ${this.mode}`;
    }

});

module.exports = BitmapMask;
