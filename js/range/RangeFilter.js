(function() {

    function RangeFilter(column) {

        PxFacetSearch.ColumnFilter.call(this, column);

        this.includeNulls = true;

        // NOTE: min and max are inclusive values
        var validRange = this.column.getValidRange();
        this.min = validRange.min;
        this.max = validRange.max;        
    }

    RangeFilter.prototype = Object.create(PxFacetSearch.ColumnFilter.prototype);
    RangeFilter.prototype.constructor = RangeFilter;

    RangeFilter.prototype.select = function(query) {

        var prevMin = this.min,
            prevMax = this.max,
            prevIncludeNulls = this.includeNulls;

        this.min = query.min;
        this.max = query.max;
        this.includeNulls = query.includeNulls;

        var changeInfo = this.column.getRangeChanges(
            prevMin, prevMax, this.min, this.max);

        // TODO: handle nulls
        
        return this.updateSelections(changeInfo.addIds, changeInfo.removeIds);
    };  

    PxFacetSearch.RangeFilter = RangeFilter;

})();