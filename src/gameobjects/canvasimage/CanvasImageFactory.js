var CanvasImage = require('./CanvasImage');
var GameObjectFactory = require('../GameObjectFactory');


GameObjectFactory.register('canvasImage', function (x, y, width, height)
{
    return this.displayList.add(new CanvasImage(this.scene, x, y, width, height));
});
