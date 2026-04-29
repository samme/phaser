/**
 * @author       Richard Davey <rich@phaser.io>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const CameraEvents = require('../../cameras/2d/events');
const Class = require('../../utils/Class');
const CONST = require('../../const');
const CSSRenderNode = require('./CSSRenderNode');
const EventEmitter = require('eventemitter3');
const Events = require('../events');
const HTMLElementPool = require('./HTMLElementPool');
const ScaleEvents = require('../../scale/events');
const TextureEvents = require('../../textures/events');
const GameEvents = require('../../core/events');
const TintFilter = require('./TintFilter');
const SVGFilterFactory = require('./SVGFilterFactory');

/**
 * @classdesc
 *
 * @class CSSRenderer
 * @extends Phaser.Events.EventEmitter
 * @memberof Phaser.Renderer.CSS
 * @constructor
 * @since 4.0.0
 *
 * @param {Phaser.Game} game - The Phaser Game instance that owns this renderer.
 */
const CSSRenderer = new Class({

    Extends: EventEmitter,

    initialize:

    function CSSRenderer (game)
    {
        EventEmitter.call(this);

        const gameConfig = game.config;

        /**
         * The local configuration settings of the CSSRenderer.
         *
         * @name Phaser.Renderer.CSS.CSSRenderer#config
         * @type {object}
         * @since 3.0.0
         */
        this.config = {
            backgroundColor: gameConfig.backgroundColor,
            antialias: gameConfig.antialias,
            roundPixels: gameConfig.roundPixels,
            transparent: gameConfig.transparent
        };

        /**
         * The Phaser Game instance that owns this renderer.
         *
         * @name Phaser.Renderer.CSS.CSSRenderer#game
         * @type {Phaser.Game}
         * @since 3.0.0
         */
        this.game = game;

        /**
         * A constant which allows the renderer to be easily identified as a Canvas Renderer.
         *
         * @name Phaser.Renderer.CSS.CSSRenderer#type
         * @type {number}
         * @since 3.0.0
         */
        this.type = CONST.CSS;

        /**
         * The total number of elements visited by the renderer in a frame.
         *
         * @name Phaser.Renderer.CSS.CSSRenderer#drawCount
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.drawCount = 0;

        this.cleanCount = 0;

        this.dirtyCount = 0;

        this.mutateCount = 0;

        /**
         * The width of the stage being rendered to.
         *
         * @name Phaser.Renderer.CSS.CSSRenderer#width
         * @type {number}
         * @since 3.0.0
         */
        this.width = 0;

        /**
         * The height of the stage being rendered to.
         *
         * @name Phaser.Renderer.CSS.CSSRenderer#height
         * @type {number}
         * @since 3.0.0
         */
        this.height = 0;

        /**
         * Should the Canvas use Image Smoothing or not when drawing Sprites?
         *
         * @name Phaser.Renderer.CSS.CSSRenderer#antialias
         * @type {boolean}
         * @since 3.20.0
         */
        this.antialias = gameConfig.antialias;

        /**
         * Has this renderer fully booted yet?
         *
         * @name Phaser.Renderer.CSS.CSSRenderer#isBooted
         * @type {boolean}
         * @since 3.50.0
         */
        this.isBooted = false;

        this.debugText = null;
        this.drawCountMeter = null;
        this.efficiency = 0;
        this.efficiencyMeter = null;
        this.mutateCountMeter = null;
        this.parent = null;
        this.pool = null;
        this.poolMeter = null;
        this.renderDuration = 0;
        this.renderStartTime = 0;
        this.stage = null;
        this.styleElement = null;
        this.filterContainer = null;
        this.fpsMeter = null;
        this.deltaMeter = null;

        console.time('CSS Renderer Init');
        console.time('CSS Renderer Boot');

        this.init();
    },

    /**
     * Prepares the stage for rendering.
     *
     * @method Phaser.Renderer.CSS.CSSRenderer#init
     * @since 3.0.0
     */
    init ()
    {
        const { game } = this;

        game.events.once(GameEvents.BOOT, this.preBoot, this);

        game.textures.once(TextureEvents.READY, this.boot, this);

        console.timeEnd('CSS Renderer Init');
    },

    preBoot ()
    {

        const { config, game } = this;
        const { parent } = this.game.scale;

        this.parent = parent;

        this.stage = game.domContainer;

        this.pool = new HTMLElementPool('div');

        const filterContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        filterContainer.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        filterContainer.setAttribute('width', '0');
        filterContainer.setAttribute('height', '0');
        filterContainer.dataset.name = 'filterContainer';

        this.filterContainer = filterContainer;

        parent.appendChild(this.filterContainer);

        this.stage.dataset.name = 'stage';
        this.stage.style.contain = 'layout';
        this.stage.style.imageRendering = config.antialias ? 'auto' : 'pixelated';

        if (!config.transparent)
        {
            this.stage.style.backgroundColor = config.backgroundColor.rgba;
        }

        this.initDebug();
    },

    initDebug ()
    {
        require('./debug.css');

        const debugHTML = require('./debug.html');

        const tpl = document.createElement('template');
        tpl.innerHTML = debugHTML.trim();

        this.parent.appendChild(tpl.content);

        this.debugText = this.parent.querySelector('#debug-text');

        this.drawCountMeter = this.parent.querySelector('#debug-draw-count');
        this.efficiencyMeter = this.parent.querySelector('#debug-efficiency');
        this.mutateCountMeter = this.parent.querySelector('#debug-mutate-count');
        this.poolMeter = this.parent.querySelector('#debug-pool-size');
        this.deltaMeter = this.parent.querySelector('#debug-delta');
        this.fpsMeter = this.parent.querySelector('#debug-fps');
    },

    /**
     * Internal boot handler.
     *
     * @method Phaser.Renderer.CSS.CSSRenderer#boot
     * @private
     * @since 3.50.0
     */
    boot ()
    {
        const { game } = this;
        const { baseSize } = game.scale;

        this.width = baseSize.width;
        this.height = baseSize.height;

        this.isBooted = true;

        game.scale.on(ScaleEvents.RESIZE, this.onResize, this);

        this.resize(baseSize.width, baseSize.height);

        console.timeEnd('CSS Renderer Boot');
    },

    /**
     * The event handler that manages the `resize` event dispatched by the Scale Manager.
     *
     * @method Phaser.Renderer.CSS.CSSRenderer#onResize
     * @since 3.16.0
     *
     * @param {Phaser.Structs.Size} gameSize - The default Game Size object. This is the un-modified game dimensions.
     * @param {Phaser.Structs.Size} baseSize - The base Size object. The game dimensions multiplied by the resolution. The canvas width / height values match this.
     */
    onResize (gameSize, baseSize)
    {
        //  Has the underlying canvas size changed?
        if (baseSize.width !== this.width || baseSize.height !== this.height)
        {
            this.resize(baseSize.width, baseSize.height);
        }
    },

    /**
     * Resize the main game canvas.
     *
     * @method Phaser.Renderer.CSS.CSSRenderer#resize
     * @fires Phaser.Renderer.Events#RESIZE
     * @since 3.0.0
     *
     * @param {number} [width] - The new width of the renderer.
     * @param {number} [height] - The new height of the renderer.
     */
    resize (width, height)
    {
        this.width = width;
        this.height = height;

        this.emit(Events.RESIZE, width, height);
    },

    attachScene (scene)
    {
        this.stage.appendChild(scene.sys.renderNode.element);

        this.mutateCount++;
    },

    append (child, parent)
    {
        parent.element.appendChild(child.element);

        this.mutateCount++;
    },

    removeRenderNode (renderNode)
    {
        renderNode.element.remove();

        this.mutateCount++;
    },

    attachCamera (camera)
    {
        const { viewportRenderNode, worldViewRenderNode, fadeRenderNode, flashRenderNode } = camera;

        this.append(worldViewRenderNode, viewportRenderNode);
        this.append(fadeRenderNode, viewportRenderNode);
        this.append(flashRenderNode, viewportRenderNode);
        this.append(viewportRenderNode, camera.scene.sys.renderNode);
    },

    createRenderNode ()
    {
        return new CSSRenderNode(this.pool.acquire());
    },

    destroyRenderNode (renderNode)
    {
        const released = this.pool.release(renderNode.element);

        if (released)
        {
            // Assume this was a removal.

            this.mutateCount++;
        }

        renderNode.destroy();
    },

    createTintFilter ()
    {
        return new TintFilter(new SVGFilterFactory('Tint'));
    },

    /**
     * Called at the start of the render loop.
     *
     * @method Phaser.Renderer.CSS.CSSRenderer#preRender
     * @fires Phaser.Renderer.Events#PRE_RENDER
     * @since 3.0.0
     */
    preRender ()
    {
        this.drawCount = 0;
        this.cleanCount = 0;
        this.dirtyCount = 0;
        this.mutateCount = 0;

        this.renderStartTime = performance.now();

        this.emit(Events.PRE_RENDER);
    },

    /**
     * The core render step for a Scene Camera.
     *
     * Iterates through the given array of Game Objects and renders them with the given Camera.
     *
     * This is called by the `CameraManager.render` method. The Camera Manager instance belongs to a Scene, and is invoked
     * by the Scene Systems.render method.
     *
     * @method Phaser.Renderer.CSS.CSSRenderer#render
     * @fires Phaser.Renderer.Events#RENDER
     * @since 3.0.0
     *
     * @param {Phaser.Scene} scene - The Scene to render.
     * @param {Phaser.GameObjects.GameObject[]} children - An array of filtered Game Objects that can be rendered by the given Camera.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Scene Camera to render with.
     * @param {boolean} displayListDirty - Whether the Display List contents have changed since the last render.
     */
    render (scene, children, camera, displayListDirty)
    {
        const childCount = children.length;

        this.emit(Events.RENDER, scene, camera);

        camera.emit(CameraEvents.PRE_RENDER, camera);

        this.renderCamera(camera);

        this.drawCount += childCount;

        this.countDirtyState(displayListDirty, childCount);

        const parentElement = camera.worldViewRenderNode.element;

        for (let i = 0; i < childCount; i++)
        {
            const child = children[i];

            if (typeof child.renderCSS !== 'function')
            {
                throw new Error(`Game Object type ${child.type} has no renderCSS() method`);
            }

            child.renderCSS(this, child, camera);

            if (displayListDirty)
            {
                parentElement.appendChild(child.node || child.renderNode.element);

                this.mutateCount++;
            }
        }

        camera.dirty = false;

        camera.emit(CameraEvents.POST_RENDER, camera);
    },

    /**
     * Restores the game context's global settings and takes a snapshot if one is scheduled.
     *
     * The post-render step happens after all Cameras in all Scenes have been rendered.
     *
     * @method Phaser.Renderer.CSS.CSSRenderer#postRender
     * @fires Phaser.Renderer.Events#POST_RENDER
     * @since 3.0.0
     */
    postRender ()
    {
        const { cleanCount, dirtyCount, drawCount, mutateCount, pool, game, drawCountMeter, mutateCountMeter, efficiencyMeter, poolMeter, fpsMeter, deltaMeter, debugText } = this;
        const { usedSize, totalSize } = pool;
        const { actualFps, rawDelta } = game.loop;

        this.emit(Events.POST_RENDER);

        this.efficiency = cleanCount / (cleanCount + dirtyCount);

        const hasEfficiency = Number.isFinite(this.efficiency);

        this.renderDuration = performance.now() - this.renderStartTime;

        drawCountMeter.value = drawCount;

        mutateCountMeter.value = mutateCount;

        poolMeter.value = usedSize;
        poolMeter.max = totalSize;

        fpsMeter.value = actualFps;

        deltaMeter.value = rawDelta;

        let efficiencyString;

        if (hasEfficiency)
        {
            efficiencyMeter.value = this.efficiency;
            efficiencyString = `${(100 * this.efficiency).toFixed(0)}%`;
        }
        else
        {
            efficiencyString = '----';
        }

        debugText.textContent = `Draw: ${String(drawCount).padStart(3, ' ')} | Mutate: ${String(mutateCount).padStart(3, ' ')} | Pool: ${usedSize}/${totalSize} | Efficiency: ${efficiencyString} (${cleanCount}:${dirtyCount}) | FPS: ${actualFps.toFixed(1)} | Δt: ${rawDelta.toFixed(1)}ms | Render: ${this.renderDuration.toFixed(1)}ms`;
    },

    renderCamera (camera)
    {
        const {
            fadeEffect,
            fadeRenderNode,
            filters,
            flashEffect,
            flashRenderNode,
            mask,
            viewportRenderNode,
            worldViewRenderNode
        } = camera;

        viewportRenderNode.setAlpha(camera.alpha);

        if (filters._filters.length > 0)
        {
            filters.preRender();

            viewportRenderNode.setProperty('filter', filters.getCSS());
        }
        else
        {
            viewportRenderNode.setProperty('filter', null);
        }

        if (mask && mask.active)
        {
            viewportRenderNode.setProperty(mask.name, mask.getCSSValue());
        }
        else
        {
            viewportRenderNode.setProperty('clipPath', null);
            viewportRenderNode.setProperty('mask', null);
        }

        if (camera.transparent)
        {
            viewportRenderNode.setProperty('backgroundColor', null);
        }
        else
        {
            viewportRenderNode.setProperty('backgroundColor', camera.backgroundColor.rgba);
        }

        // "A dirty Camera has had either its viewport size, bounds, scroll, rotation or zoom levels changed."
        if (camera.dirty)
        {
            viewportRenderNode.setXY(camera.x, camera.y);
            viewportRenderNode.setSize(camera.width, camera.height);

            fadeRenderNode.setXY(camera.x, camera.y);
            fadeRenderNode.setSize(camera.width, camera.height);

            flashRenderNode.setXY(camera.x, camera.y);
            flashRenderNode.setSize(camera.width, camera.height);

            // Camera origin seems to be included here.
            worldViewRenderNode.setProperty('transform', camera.matrix.getCSSMatrix());
        }

        fadeRenderNode.element.dataset.isRunning = fadeEffect.isRunning;
        fadeRenderNode.element.dataset.isComplete = fadeEffect.isComplete;

        flashRenderNode.element.dataset.isRunning = flashEffect.isRunning;

        if (fadeEffect.isRunning || fadeEffect.isComplete)
        {
            fadeRenderNode.show();
            fadeRenderNode.setProperty('backgroundColor', `rgba(${fadeEffect.red}, ${fadeEffect.green}, ${fadeEffect.blue}, ${fadeEffect.alpha})`);
        }
        else
        {
            fadeRenderNode.hide();
        }

        if (flashEffect.isRunning)
        {
            flashRenderNode.show();
            flashRenderNode.setProperty('backgroundColor', `rgba(${flashEffect.red}, ${flashEffect.green}, ${flashEffect.blue}, ${flashEffect.alpha})`);
        }
        else
        {
            flashRenderNode.hide();
        }
    },

    /**
     * Takes a Sprite Game Object, or any object that extends it, and draws it to the current context.
     *
     * @method Phaser.Renderer.CSS.CSSRenderer#batchSprite
     * @since 3.12.0
     *
     * @param {Phaser.GameObjects.GameObject} sprite - The texture based Game Object to draw.
     * @param {Phaser.Textures.Frame} frame - The frame to draw, doesn't have to be that owned by the Game Object.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to use for the rendering transform.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentTransformMatrix] - The transform matrix of the parent container, if set.
     */
    batchSprite (sprite, frame, camera, parentTransformMatrix)
    {
        throw new Error('Removed 😛');
    },

    countDirtyState (dirty, count)
    {
        if (typeof count !== 'number')
        {
            throw new TypeError('count argument must be a number');
        }

        if (typeof dirty !== 'boolean')
        {
            throw new TypeError('dirty argument must be a boolean');
        }

        if (dirty)
        {
            this.dirtyCount += count;
        }
        else
        {
            this.cleanCount += count;
        }
    },

    /**
     * Destroys all object references in the Canvas Renderer.
     *
     * @method Phaser.Renderer.CSS.CSSRenderer#destroy
     * @since 3.0.0
     */
    destroy ()
    {
        this.removeAllListeners();

        this.game = null;
    }

});

module.exports = CSSRenderer;
