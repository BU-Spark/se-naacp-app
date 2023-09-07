// Local cache based on (LRU) policy (Least Recently Used)

// Things to improve:
// Cache needs to written with a Hit/Miss Count so we can adjust eviction percentages dynamically

// _cache: Map -> A hashmap that <k, v> implementation
// _evictionCount: Number -> The max count of items before eviction policy is invoked
// _timeDLL -> Doubly linked list to track frequency items, this contains the reference of the node that was last inserted
// ... 
class LRUCache {
    constructor(
        cacheMap, 
        maxCount
    ) {
        this._cache = cacheMap;
        this._evictionCount = maxCount;
        this._timeDLL = undefined; // Was debating to place a dummy head...
        this._leastRecentLLBlock = undefined; // Contains a back reference of the DLL
    }

    // Internal Linked List (Note: I want to make this a private class, but JS sucks.)
    // _timeStamp: Date -> A date object that represents the time stamp for Metadata purposes
    // _key: Key -> A reference of the item key so that it may be deleted easily
    // _metaData: JS Object -> For the future, perhaps we have some metadata we want to leverage during cacheing
    // _next: LL_Block (Memory Reference) -> Memory reference to the block ahead if applicable
    // _prev: LL_Block (Memory Reference) -> Memory reference to the block previous if applicable
    LL_Block = class {
        constructor(
            timeStamp,
            key,
            metaData,
            next,
            prev
        ) {
            this._timeStamp = timeStamp;
            this._key = key
            this._metaData = metaData
            this._next = next;
            this._prev = prev;
        }
    }

    // Just incase we need it...
    DLL_Iterator = class {
        constructor() {

        }
    }

    get cache() {
        return this._cache;
    }

    get evictionCount() {
        return this._evictionCount;
    }

    // FOR DEBUG PURPOSES ONLY, BAD TO OVERFLOW CONSOLE IF _evictionCount is BIG
    traverseDLLTimeList() {
        let counter = 1;

        if (this._timeDLL !== undefined) {
            let curr = this._timeDLL;
            while(curr._next !== undefined) {
                // console.log("Time Stamp:", LRUCache.formatAMPM(curr._timeStamp));
                // console.log("Key:", curr._key);
                curr = curr._next;
                counter++;
            }
        } else {
            console.log("Nothing to traverse")
        }

        console.log("Traversed Items:", counter);
    }

    insertIntoCache(key, value) {
        // Invoke eviction policy, default is 20%
        if (this._cache.size > this._evictionCount) { // We don't use the DLL size, but map size. Both should be updated
            console.log("Evicting Cache!");
            this.evictCache(0.2);
        }

        let date = new Date();

        if (this._timeDLL == undefined) {
            let newLLBlock = new this.LL_Block(date, key, {}, undefined, undefined);
            this._leastRecentLLBlock = newLLBlock;
            this._timeDLL = newLLBlock
        } else {
            let newLLBlock = new this.LL_Block(date, key, {}, this._timeDLL, undefined); // Front of the DLL
            this._timeDLL._prev = newLLBlock;
            this._timeDLL = newLLBlock;
        }

        this._cache.set(key, value);
    }

    evictCache(percentage) {
        let entriesToDelete = Math.round(this._evictionCount * percentage);

        if (this._leastRecentLLBlock.next !== undefined) {
            console.log("EVICTION ERROR! TAIL REFERENCE IS NOT ACTUALLY AT TAIL")
            return;
        }

        for (let i = 0; i < entriesToDelete; i++) {
            this._cache.delete(this._leastRecentLLBlock._key);
            this._leastRecentLLBlock = this._leastRecentLLBlock._prev;
        }

        // Cut the rest of the DLL off, Garbage collection will destroy these memory references
        this._leastRecentLLBlock._next = undefined; 

        return;
    }

    // Some static funcs I like to use
    static formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;

        return strTime;
    }
}

module.exports = {
    LRUCache,
}