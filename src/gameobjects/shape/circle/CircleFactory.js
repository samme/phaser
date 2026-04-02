var Circle = require('./Circle');
var GameObjectFactory = require('../../GameObjectFactory');

/**
 * Creates a new Circle Shape Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Circle Game Object has been built into Phaser.
 *
 * The Circle Shape is a Game Object that can be added to a Scene, Group or Container. You can
 * treat it like any other Game Object in your game, such as tweening it, scaling it, or enabling
 * it for input or physics. It provides a quick and easy way for you to render this shape in your
 * game without using a texture, while still taking advantage of being fully batched in WebGL.
 *
 * This shape supports both fill and stroke colors.
 *
 * @method Phaser.GameObjects.GameObjectFactory#Circle
 * @since 3.13.0
 *
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [radius=128] - The radius of the Circle.
 * @param {number} [fillColor] - The color the Circle will be filled with, i.e. 0xff0000 for red.
 * @param {number} [fillAlpha] - The alpha the Circle will be filled with. You can also set the alpha of the overall Shape using its `alpha` property.
 *
 * @return {Phaser.GameObjects.Circle} The Game Object that was created.
 */
GameObjectFactory.register('circle', function (x, y, radius, fillColor, fillAlpha)
{
    return this.displayList.add(new Circle(this.scene, x, y, radius, fillColor, fillAlpha));
});

