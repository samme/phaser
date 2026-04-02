
/**
 * A pool of reusable HTML elements.
 */
class HTMLElementPool
{
    /**
     * @param {string} [elementName='div'] - The HTML tag name for pooled elements.
     */
    constructor (elementName = 'div')
    {
        this.elementName = elementName;
        this._free = [];
        this._used = new Set();
    }

    /**
     * Creates a new HTML element.
     * @returns {HTMLElement}
     */
    createElement ()
    {
        if (this.totalSize >= 10000)
        {
            throw new Error('HTMLElementPool: Maximum pool size of 10000 exceeded');
        }

        return document.createElement(this.elementName);
    }

    /**
     * Acquires an element from the pool, or creates a new one if the pool is empty.
     * @returns {HTMLElement}
     */
    acquire ()
    {
        const element = this._free.pop() || this.createElement();

        this._used.add(element);

        return element;
    }

    /**
     * Ensures the pool has at least the specified number of free elements.
     * @param {number} count - The number of free elements to reserve.
     */
    reserve (count)
    {
        while (this._free.length < count)
        {
            this._free.push(this.createElement());
        }
    }

    /**
     * Releases an element back into the pool.
     * @param {HTMLElement} element - The element to release.
     */
    release (element)
    {
        if (!this._used.has(element))
        {
            return false;
        }

        this._used.delete(element);

        if (element.parentNode)
        {
            element.parentNode.removeChild(element);
        }

        this._free.push(element);

        return true;
    }

    /**
     * Releases all used elements.
     */
    releaseAll ()
    {
        for (const element of this._used)
        {
            this.release(element);
        }
    }

    /**
     * Destroys all elements and clears the pool.
     */
    destroy ()
    {
        for (const element of this._used)
        {
            if (element.parentNode)
            {
                element.parentNode.removeChild(element);
            }
        }

        this._used.clear();
        this._free.length = 0;
    }

    /**
     * The total number of elements managed by this pool (active + pooled).
     * @returns {number}
     */
    get totalSize ()
    {
        return this._free.length + this._used.size;
    }

    /**
     * The number of elements currently available in the pool.
     * @returns {number}
     */
    get freeSize ()
    {
        return this._free.length;
    }

    /**
     * The number of currently active (acquired) elements.
     * @returns {number}
     */
    get usedSize ()
    {
        return this._used.size;
    }
}

module.exports = HTMLElementPool;
