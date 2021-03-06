(function() {
    
    // Filter keeps track of a single union query (a OR b) of values
    // for a single property.

    function Filter(name) {
        
        this.name = name;

        // bool array keeping track of local matches
        this.matches = [];
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


    // Filter tied to a single column
    function ColumnFilter(column) {

        this.column = column;
        PxFacetSearch.Filter.call(this, column.name);
    }

    ColumnFilter.prototype = Object.create(PxFacetSearch.Filter.prototype);
    ColumnFilter.prototype.constructor = ColumnFilter;

    PxFacetSearch.ColumnFilter = ColumnFilter;

})();