(function() {
    
    // CategoryFilter keeps track of a single union query (a OR b) of values
    // for a single property with categorical data.

    function CategoryFilter(column) {
        
        this.name = column.name;
        this.column = column;

        // keep track of current selections
        this.selections = this.column.getPotentialValues();

        // bool array keeping track of local matches
        this.matches = [];
        PxFacetSearch.initArray(this.matches, column.values.length, true);
    }

    CategoryFilter.prototype.select = function(values) {

        var removeValues = PxFacetSearch.except(this.selections, values),
            removeIds = this.column.getRemoveIds(removeValues, values),
            addValues = PxFacetSearch.except(values, this.selections),
            potentialAddIds = this.column.getMatchAnyIds(addValues),
            addedIds = [],
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

        this.selections = values;

        return { addIds: addedIds, removeIds: removeIds };
    };  

    PxFacetSearch.CategoryFilter = CategoryFilter;

})();