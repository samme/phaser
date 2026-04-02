const Class = require('../../utils/Class');
const Components = require('../../gameobjects/components');

const BitmapMask = new Class({

    Mixins: [
        Components.Size,
        Components.Texture
    ],

    initialize:

    function BitmapMask (scene, x, y, texture, maskSize = null, repeat = 'no-repeat', mode = 'alpha')
    {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.setTexture(texture);

        this.maskSize = maskSize;
        this.repeat = repeat;
        this.mode = mode;
    },

    getCSSMask: function ()
    {
        const maskSize = this.maskSize || `${this.displayWidth}px ${this.displayHeight}px`;

        return `${this.frame.source.cssImage} ${this.x}px ${this.y}px / ${maskSize} ${this.repeat} ${this.mode}`;
    }

});

module.exports = BitmapMask;
