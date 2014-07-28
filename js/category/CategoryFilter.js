(function() {
    
    // CategoryFilter keeps track of a single union query (a OR b) of values
    // for a single property with categorical data.

    function CategoryFilter(column) {

        PxFacetSearch.Filter.call(this, column);

        // keep track of current selections
        this.selections = this.column.getPotentialValues();
    }

    CategoryFilter.prototype = Object.create(PxFacetSearch.Filter.prototype);
    CategoryFilter.prototype.constructor = CategoryFilter;

    CategoryFilter.prototype.select = function(values) {

        var removeValues = PxFacetSearch.except(this.selections, values),
            removeIds = this.column.getRemoveIds(removeValues, values),
            addValues = PxFacetSearch.except(values, this.selections),
            potentialAddIds = this.column.getMatchAnyIds(addValues);

        this.selections = values;
        return this.updateSelections(potentialAddIds, removeIds);
    };  

    PxFacetSearch.CategoryFilter = CategoryFilter;

})();