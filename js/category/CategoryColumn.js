(function() {
    
    // Columns store data for a single property. CategoryColumn
    // stores categorical data.

    function CategoryColumn(name, values) {
 
        // index mapping category to ids
        this.categoryIds = {};

        var columnType = PxFacetSearch.ColumnType.category;
        PxFacetSearch.MultivalueColumn.call(this, name, values, columnType);
    }

    CategoryColumn.prototype = Object.create(PxFacetSearch.MultivalueColumn.prototype);
    CategoryColumn.prototype.constructor = CategoryColumn;

    CategoryColumn.prototype.indexSingleValue = function(val, id) {

        // ensure we have an array of ids for the value
        var category = this.categoryIds[val];
        if (!category) {
            category = this.categoryIds[val] = [];
        }

        category.push(id);
    };

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

    CategoryColumn.prototype.getMatchAnyIds = function(matchValues) {

        var matchIds = [],
            i, len, ids;

        for (i = 0, len = matchValues.length; i < len; i++) {
            ids = this.getMatchIds(matchValues[i]);
            matchIds = matchIds.concat(ids);
        }

        // for multivalue, we need to de-dup the results
        if (this.isMultiValue) {
            matchIds = PxFacetSearch.unique(matchIds);
        }

        return matchIds;
    };

    CategoryColumn.prototype.matchesAny = function(id, matchValues) {

        matchValues = matchValues || [];

        var val = this.values[id],
            i, len;

        // single values are simple contains checks
        if (!Array.isArray(val)) {
            return (matchValues.indexOf(val) >= 0);
        } 

        // for multivalue, we need to check each sub value
        for (i = 0, len = val.length; i < len; i++) {
            if (matchValues.indexOf(val[i]) >= 0) {
                return true;
            }
        }

        return false;
    };

    CategoryColumn.prototype.getRemoveIds = function(removeValues, matchValues) {

        var removeIds = [],
            i, len, ids;
        
        // get ids for items that no longer match
        for (i = 0, len = removeValues.length; i < len; i++) {
            ids = this.getMatchIds(removeValues[i]);
            removeIds = removeIds.concat(ids);
        }

        // for single-value columns no further checks needed
        if (!this.isMultiValue) {
            return removeIds;
        }

        // for mutli-value, first de-dup the ids
        removeIds = PxFacetSearch.unique(removeIds);

        // need to check that remove ids don't match ANY of the 
        // selected values (even if one of their values was removed)
        var noMatchIds = [],
            mvLength = matchValues.length,
            id, val, j;

        for (i = 0, len = removeIds.length; i < len; i++) {
            id = removeIds[i];
            if (!this.matchesAny(id, matchValues)) {
                noMatchIds.push(id);
            }
        }
        
        return noMatchIds;
    };

    PxFacetSearch.CategoryColumn = CategoryColumn;


})();