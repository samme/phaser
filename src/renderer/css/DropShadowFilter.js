class DropShadowFilter
{
    constructor (offsetX, offsetY, blur, color)
    {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.blur = blur;
        this.color = color;
        this.active = true;
    }

    toString ()
    {
        return `drop-shadow(${this.offsetX}px ${this.offsetY}px ${this.blur}px ${this.color})`;
    }
}

module.exports = DropShadowFilter;
