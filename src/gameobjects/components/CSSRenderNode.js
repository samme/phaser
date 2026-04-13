const RENDER_MASK = 15;

const CSSRenderNode = {
    renderNode: null,

    tintNode: null,

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
    }
};

module.exports = CSSRenderNode;
