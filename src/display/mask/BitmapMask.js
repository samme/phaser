const Class = require('../../utils/Class');
const Components = require('../../gameobjects/components');

const BitmapMask = new Class({

    Mixins: [
        Components.Size,
        Components.Texture
    ],

    initialize:

    function BitmapMask (scene, x, y, texture, cssPosition = null, cssSize = null, repeat = 'no-repeat', mode = 'alpha')
    {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.scaleX = 1;
        this.scaleY = 1;

        this.setTexture(texture);

        this.cssPosition = cssPosition;
        this.cssSize = cssSize;
        this.repeat = repeat;
        this.mode = mode;

        this.name = 'mask';

        this.active = true;
    },

    getCSSValue: function ()
    {
        const cssPosition = this.cssPosition || `${this.x}px ${this.y}px`;
        const cssSize = this.cssSize || `${this.displayWidth}px ${this.displayHeight}px`;

        return `${this.frame.source.cssImage} ${cssPosition} / ${cssSize} ${this.repeat} ${this.mode}`;
    }

});

module.exports = BitmapMask;
