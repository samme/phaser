// Intended for Blitter, Container, Layer, TilemapLayer.

const CSSFreeze = {
    _frozenRendered: false,

    isFrozen: false,

    freeze: function ()
    {
        this.isFrozen = true;
        this._frozenRendered = false;

        return this;
    },

    unfreeze: function ()
    {
        this.isFrozen = false;
        this._frozenRendered = false;

        return this;
    }
};

module.exports = CSSFreeze;
