var BlitterText = require('./BlitterText');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new BlitterText Game Object and adds it to the Scene.
 *
 * @method Phaser.GameObjects.GameObjectFactory#blitterText
 * @since 5.0.0
 *
 * @param {number} x - The x position of the Game Object.
 * @param {number} y - The y position of the Game Object.
 * @param {string} font - The key of the font to use from the Bitmap Font cache.
 *
 * @return {Phaser.GameObjects.BlitterText} The Game Object that was created.
 */
GameObjectFactory.register('blitterText', function (x, y, font, text)
{
    return this.displayList.add(new BlitterText(this.scene, x, y, font, text));
});
