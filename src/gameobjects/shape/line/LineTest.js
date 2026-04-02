/* eslint-disable no-console */
// Simple test for Line.setTo() method
const line = new Phaser.GameObjects.Line(
    { sys: { queueDepthSort: function () {} } },
    0, 0,
    0, 0,
    1, 2
);

console.info('4 assertions should pass …');

console.assert(line.width === 1, 'Initial width should be 1');
console.assert(line.height === 2, 'Initial height should be 2');

line.setTo(100, 100, 103, 105);

console.assert(line.width === 3, 'Width after setTo() should be 3');
console.assert(line.height === 5, 'Height after setTo() should be 5');

console.info('Done');
