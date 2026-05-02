var Blitter = require('../blitter/Blitter');
var Class = require('../../utils/Class');

var BlitterText = new Class({

    Extends: Blitter,

    initialize:

    function BlitterText (scene, x, y, font, text = '')
    {
        var fontEntry = scene.sys.cache.bitmapFont.get(font);

        if (!fontEntry)
        {
            throw new Error('No Bitmap Font key of "' + font + '" found in the Bitmap Font Cache');
        }

        Blitter.call(this, scene, x, y, fontEntry.texture, fontEntry.frame);

        this.fontData = fontEntry.data;

        console.debug('fontData', this.fontData);

        var spaceChar = this.fontData.chars[32];

        this.spaceWidth = spaceChar ? spaceChar.xAdvance : this.fontData.size / 2;

        this.type = 'BlitterText';

        this._text = '';

        this.setText(text);
    },

    setText (text)
    {
        if (text === this._text)
        {
            return this;
        }

        this._text = text;

        const { chars } = this.fontData;
        const { list } = this.children;

        let bobIndex = 0;
        let xOffset = 0;

        for (let i = 0; i < text.length; i++)
        {
            const char = text[i];
            const charData = chars[char.charCodeAt(0)];

            if (char === ' ')
            {
                xOffset += this.spaceWidth;

                continue;
            }

            let bob;

            if (bobIndex < list.length)
            {
                bob = list[bobIndex];
            }
            else
            {
                bob = this.create(0, 0, char);
            }

            bob.setVisible(true);
            bob.setFrame(char);
            bob.x = xOffset;
            bob.y = charData.yOffset;

            xOffset += bob.frame.width;
            bobIndex++;
        }

        // Hide extra bobs
        for (let i = bobIndex; i < list.length; i++)
        {
            list[i].setVisible(false);
        }

        return this;
    },

    text: {

        set: function (value)
        {
            this.setText(value);
        },

        get: function ()
        {
            return this._text;
        }

    }

});

module.exports = BlitterText;
