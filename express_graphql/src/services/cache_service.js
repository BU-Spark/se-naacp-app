class genericLocalCache {
    constructor(cacheMap, maxCount) {
        this._cache = cacheMap;
        this._evictionCount = maxCount;
    }

    get cache() {
        return this._cache;
    }

    get evictionCount() {
        return this._evictionCount;
    }

    // For Future Network and probability look ups....

}

module.exports = {
    genericLocalCache,
}