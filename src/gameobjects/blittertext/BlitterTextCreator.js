var BlitterText = require('./BlitterText');
var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');

/**
 * Creates a new BlitterText Game Object and returns it.
 *
 * @method Phaser.GameObjects.GameObjectCreator#blitterText
 * @since 5.0.0
 *
 * @param {Phaser.Types.GameObjects.Sprite.SpriteConfig} config - The configuration object this Game Object will use to create itself. The `key` property identifies the texture to use, and the optional `frame` property identifies a specific frame within that texture.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.BlitterText} The Game Object that was created.
 */
GameObjectCreator.register('blitterText', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var font = GetAdvancedValue(config, 'font', null);

    var blitter = new BlitterText(this.scene, 0, 0, font);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, blitter, config);

    return blitter;
});
