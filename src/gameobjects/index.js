/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.GameObjects
 */

var GameObjects = {

    Events: require('./events'),

    DisplayList: require('./DisplayList'),
    GameObjectCreator: require('./GameObjectCreator'),
    GameObjectFactory: require('./GameObjectFactory'),
    UpdateList: require('./UpdateList'),

    Components: require('./components'),
    GetCalcMatrix: require('./GetCalcMatrix'),

    BuildGameObject: require('./BuildGameObject'),
    BuildGameObjectAnimation: require('./BuildGameObjectAnimation'),
    GameObject: require('./GameObject'),
    BitmapText: require('./bitmaptext/static/BitmapText'),
    Blitter: require('./blitter/Blitter'),
    Bob: require('./blitter/Bob'),
    CanvasImage: require('./canvasimage/CanvasImage'),
    Container: require('./container/Container'),
    DOMElement: require('./domelement/DOMElement'),
    DynamicBitmapText: require('./bitmaptext/dynamic/DynamicBitmapText'),
    Extern: require('./extern/Extern'),
    Graphics: require('./graphics/Graphics'),
    Group: require('./group/Group'),
    Image: require('./image/Image'),
    Layer: require('./layer/Layer'),
    NineSlice: require('./nineslice/NineSlice'),
    Particles: require('./particles'),
    PathFollower: require('./pathfollower/PathFollower'),
    RenderTexture: require('./rendertexture/RenderTexture'),
    RetroFont: require('./bitmaptext/RetroFont'),
    Rope: require('./rope/Rope'),
    Sprite: require('./sprite/Sprite'),
    Stamp: require('./stamp/Stamp'),

    Text: require('./text/Text'),
    GetTextSize: require('./text/GetTextSize'),
    MeasureText: require('./text/MeasureText'),
    TextStyle: require('./text/TextStyle'),

    TileSprite: require('./tilesprite/TileSprite'),
    Zone: require('./zone/Zone'),
    Video: require('./video/Video'),

    Gradient: require('./gradient/Gradient'),
    PointLight: require('./pointlight/PointLight'),

    //  Shapes

    Shape: require('./shape/Shape'),
    Arc: require('./shape/arc/Arc'),
    Circle: require('./shape/circle/Circle'),
    Curve: require('./shape/curve/Curve'),
    Ellipse: require('./shape/ellipse/Ellipse'),
    Grid: require('./shape/grid/Grid'),
    IsoBox: require('./shape/isobox/IsoBox'),
    IsoTriangle: require('./shape/isotriangle/IsoTriangle'),
    Line: require('./shape/line/Line'),
    Polygon: require('./shape/polygon/Polygon'),
    Rectangle: require('./shape/rectangle/Rectangle'),
    Star: require('./shape/star/Star'),
    Triangle: require('./shape/triangle/Triangle'),

    //  Game Object Factories

    Factories: {
        Blitter: require('./blitter/BlitterFactory'),
        CanvasImage: require('./canvasimage/CanvasImageFactory'),
        Container: require('./container/ContainerFactory'),
        DOMElement: require('./domelement/DOMElementFactory'),
        DynamicBitmapText: require('./bitmaptext/dynamic/DynamicBitmapTextFactory'),
        Extern: require('./extern/ExternFactory'),
        Graphics: require('./graphics/GraphicsFactory'),
        Group: require('./group/GroupFactory'),
        Image: require('./image/ImageFactory'),
        Layer: require('./layer/LayerFactory'),
        NineSlice: require('./nineslice/NineSliceFactory'),
        Particles: require('./particles/ParticleEmitterFactory'),
        PathFollower: require('./pathfollower/PathFollowerFactory'),
        RenderTexture: require('./rendertexture/RenderTextureFactory'),
        Rope: require('./rope/RopeFactory'),
        Sprite: require('./sprite/SpriteFactory'),
        Stamp: require('./stamp/StampFactory'),
        StaticBitmapText: require('./bitmaptext/static/BitmapTextFactory'),
        Text: require('./text/TextFactory'),
        TileSprite: require('./tilesprite/TileSpriteFactory'),
        Zone: require('./zone/ZoneFactory'),
        Video: require('./video/VideoFactory'),

        Gradient: require('./gradient/GradientFactory'),
        PointLight: require('./pointlight/PointLightFactory'),

        //  Shapes
        Arc: require('./shape/arc/ArcFactory'),
        Circle: require('./shape/circle/CircleFactory'),
        Curve: require('./shape/curve/CurveFactory'),
        Ellipse: require('./shape/ellipse/EllipseFactory'),
        Grid: require('./shape/grid/GridFactory'),
        IsoBox: require('./shape/isobox/IsoBoxFactory'),
        IsoTriangle: require('./shape/isotriangle/IsoTriangleFactory'),
        Line: require('./shape/line/LineFactory'),
        Polygon: require('./shape/polygon/PolygonFactory'),
        Rectangle: require('./shape/rectangle/RectangleFactory'),
        Star: require('./shape/star/StarFactory'),
        Triangle: require('./shape/triangle/TriangleFactory')
    },

    Creators: {
        Blitter: require('./blitter/BlitterCreator'),
        CanvasImage: require('./canvasimage/CanvasImage'),
        Container: require('./container/ContainerCreator'),
        DynamicBitmapText: require('./bitmaptext/dynamic/DynamicBitmapTextCreator'),
        Graphics: require('./graphics/GraphicsCreator'),
        Group: require('./group/GroupCreator'),
        Image: require('./image/ImageCreator'),
        Layer: require('./layer/LayerCreator'),
        NineSlice: require('./nineslice/NineSliceCreator'),
        Particles: require('./particles/ParticleEmitterCreator'),
        RenderTexture: require('./rendertexture/RenderTextureCreator'),
        Rope: require('./rope/RopeCreator'),
        Sprite: require('./sprite/SpriteCreator'),
        Stamp: require('./stamp/StampCreator'),
        StaticBitmapText: require('./bitmaptext/static/BitmapTextCreator'),
        Text: require('./text/TextCreator'),
        TileSprite: require('./tilesprite/TileSpriteCreator'),
        Zone: require('./zone/ZoneCreator'),
        Video: require('./video/VideoCreator'),

        Gradient: require('./gradient/GradientCreator'),
        PointLight: require('./pointlight/PointLightCreator')
    }

};

module.exports = GameObjects;
