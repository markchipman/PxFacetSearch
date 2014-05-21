(function() {
    
    // Columns store data for a single property. CategoryColumn
    // stores categorical data.

    function CategoryColumn(name, values) {

        PxFacetSearch.Column.call(this, name, values);
        this.type = PxFacetSearch.ColumnType.category;
        
        // index mapping category to ids
        this.categoryIds = {};

        // keep track of items with no value
        this.nullIds = [];

        createValueIndexes.call(this);
    }

    CategoryColumn.prototype = Object.create(PxFacetSearch.Column.prototype);
    CategoryColumn.prototype.constructor = CategoryColumn;

    function createValueIndexes() {

        var i, len, val;
        for (i = 0, len = this.values.length; i < len; i++) {
            val = this.values[i];
            if (val || val === 0 || val === false) {
                
                // ensure we have an array of ids for the value
                var category = this.categoryIds[val];
                if (!category) {
                    category = this.categoryIds[val] = [];
                }

                category.push(i);

            } else {
                this.nullIds.push(i);
            }

        }
    }

    CategoryColumn.prototype.getPotentialValues = function() {
        var values = [], 
            key;
        for (key in this.categoryIds) {
            values.push(key);
        }

        if (this.nullIds.length > 0) {
            values.push(null);
        }

        return values;
    };  

    CategoryColumn.prototype.getMatchIds = function(value) {

        if (value === null) {
            return this.nullIds;
        }
        
        var ids = this.categoryIds[value];
        return ids || [];
    };

    PxFacetSearch.CategoryColumn = CategoryColumn;


})();