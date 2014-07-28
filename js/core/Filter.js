(function() {
    
    // Filter keeps track of a single union query (a OR b) of values
    // for a single property.

    function Filter(column) {
        
        this.name = column.name;
        this.column = column;

        // bool array keeping track of local matches
        this.matches = [];
        PxFacetSearch.initArray(this.matches, column.values.length, true);
    }

    Filter.prototype.updateSelections = function(potentialAddIds, removeIds) {

        var addedIds = [],
            i, len, ids, id, wasMatch;

        // toggle new additions
        for (i = 0, len = potentialAddIds.length; i < len; i++) {
            id = potentialAddIds[i];

            // need to make sure it wasn't already a match
            wasMatch = this.matches[id];
            if (!wasMatch) {
                this.matches[id] = true;
                addedIds.push(id);
            }
        }

        // toggle removed items
        for (i = 0, len = removeIds.length; i < len; i++) {
            this.matches[removeIds[i]] = false;
        }

        return { addIds: addedIds, removeIds: removeIds };
    };  

    PxFacetSearch.Filter = Filter;

})();