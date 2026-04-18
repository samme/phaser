const Rectangle = require('../../geom/rectangle/Rectangle');

const RENDER_MASK = 15;

const CSSRenderNode = {
    renderNode: null,

    initRenderNode: function ()
    {
        if (!this.renderNode)
        {
            const { renderer } = this.scene.sys;

            this.renderNode = renderer.createRenderNode();
            this.renderNode.setType(this.type);

            this.postInitRenderNode();
        }
    },

    postInitRenderNode: function ()
    {
        // Can be overridden by Game Objects.
    },

    destroyRenderNode: function ()
    {
        const { renderer } = this.scene.sys;

        renderer.destroyRenderNode(this.renderNode);

        this.renderNode = null;
    },

    willRenderCSS: function ()
    {
        return RENDER_MASK === this.renderFlags;
    },

    // Never use this.
    getRenderBounds: function (output)
    {
        if (!output)
        {
            output = new Rectangle();
        }

        const { element } = this.renderNode;
        const { cameras, renderer } = this.scene.sys;

        if (!element.parentNode)
        {
            renderer.append(this.renderNode, cameras.main.worldViewRenderNode);
        }

        this.renderCSS(renderer, this, cameras.main);

        const rect = element.getBoundingClientRect();

        output.x = rect.left;
        output.y = rect.top;
        output.width = rect.width;
        output.height = rect.height;

        return output;
    }
};

module.exports = CSSRenderNode;
