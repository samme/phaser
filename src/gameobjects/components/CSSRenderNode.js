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

            if (typeof this.postInitRenderNode === 'function')
            {
                this.postInitRenderNode();
            }
        }
    },

    destroyRenderNode: function ()
    {
        const { renderer } = this.scene.sys;

        renderer.destroyRenderNode(this.renderNode);
    },

    initTintNode: function ()
    {
        if (!this.tintNode)
        {
            const { renderer } = this.scene.sys;

            this.tintNode = renderer.createTintNode();

            renderer.attachTintNode(this.tintNode);
        }
    },

    destroyTintNode: function ()
    {
        if (this.tintNode)
        {
            this.scene.sys.renderer.destroyTintNode(this.tintNode);
        }
    },

    willRenderCSS: function ()
    {
        return RENDER_MASK === this.renderFlags;
    }
};

module.exports = CSSRenderNode;
