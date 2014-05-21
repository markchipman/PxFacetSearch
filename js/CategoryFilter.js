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
            addValues = PxFacetSearch.except(values, this.selections),
            addIds = [],
            removeIds = [],
            i, len, ids;

        // get ids for added items
        for (i = 0, len = addValues.length; i < len; i++) {
            ids = this.column.getMatchIds(addValues[i]);
            addIds = addIds.concat(ids);
        }

        // toggle matches
        for (i = 0, len = addIds.length; i < len; i++) {
            this.matches[addIds[i]] = true;
        }

        // get ids for items that no longer match
        for (i = 0, len = removeValues.length; i < len; i++) {
            ids = this.column.getMatchIds(removeValues[i]);
            removeIds = removeIds.concat(ids);
        }

        for (i = 0, len = removeIds.length; i < len; i++) {
            this.matches[removeIds[i]] = false;
        }

        this.selections = values;

        return { addIds: addIds, removeIds: removeIds };
    };  

    PxFacetSearch.CategoryFilter = CategoryFilter;

})();