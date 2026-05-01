/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../const');

/**
 * Called automatically by Phaser.Game during initialization to output a styled banner to the browser
 * console. The banner displays the Phaser version number, the active renderer (WebGL, Canvas, or
 * Headless), the audio system in use (Web Audio, HTML5 Audio, or No Audio), and optionally the
 * game title, version, and URL as configured. In browsers that support CSS console styling the
 * banner is rendered with the colors defined in the Game Config; in IE it falls back to a plain
 * text log. The banner is skipped entirely when `config.hideBanner` is `true`.
 *
 * You can customize or disable the header via the Game Config object.
 *
 * @function Phaser.Core.DebugHeader
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - The Phaser.Game instance which will output this debug header.
 */
var DebugHeader = function (game)
{
    var config = game.config;

    if (config.hideBanner)
    {
        return;
    }

    var renderType = { 0: '?', 1: 'WebGL', 2: 'Canvas', 3: 'Headless', 10: 'CSS' }[config.renderType];
    var audioConfig = config.audio;
    var deviceAudio = game.device.audio;
    var audioType;

    if (deviceAudio.webAudio && !audioConfig.disableWebAudio)
    {
        audioType = 'Web Audio';
    }
    else if (audioConfig.noAudio || (!deviceAudio.webAudio && !deviceAudio.audioData))
    {
        audioType = 'No Audio';
    }
    else
    {
        audioType = 'HTML5 Audio';
    }

    // 'Shock and Awesome v1 / Phaser v4.0.0 (WebGL | Web Audio) http://shockandawe.io'
    console.log(`👽 Quasar v${CONST.VERSION} (${renderType} | ${audioType}) samme/quasar`);
};

module.exports = DebugHeader;
