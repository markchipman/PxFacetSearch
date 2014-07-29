(function() {

    function RangeColumn(name, values) {
        
        // values in sorted order (each item may have more that one value)
        this.sortedEntries = [];

        var columnType = PxFacetSearch.ColumnType.range;
        PxFacetSearch.MultivalueColumn.call(this, name, values, columnType);

        // after indices have been created, sort the values
        this.sortedEntries.sort(NumberEntry.sortByValue);
    }

    RangeColumn.prototype = Object.create(PxFacetSearch.MultivalueColumn.prototype);
    RangeColumn.prototype.constructor = RangeColumn;

    RangeColumn.prototype.indexSingleValue = function(val, id) {
        var entry = new NumberEntry(val, id);
        this.sortedEntries.push(entry);
    };

    RangeColumn.prototype.getValidRange = function() {

        var numEntries = this.sortedEntries.length;
        if (numEntries === 0) {
            return { min: Number.MIN_VALUE, max: Number.MAX_VALUE };
        }

        return {
            min: this.sortedEntries[0].value,
            max: this.sortedEntries[numEntries-1].value
        };
    };

    RangeColumn.prototype.idInRange = function(id, min, max) {

        var val = this.values[id],
            i, len;

        // single values are simple range checks
        if (!Array.isArray(val)) {
            return (val >= min && val <= max);
        } 

        // for multivalue, we need to check each sub value
        for (i = 0, len = val.length; i < len; i++) {
            if (val[i] >= min && val[i] <= max) {
                return true;
            }
        }

        return false;
    };

    RangeColumn.prototype.getRangeChanges = function(prevMin, prevMax, newMin, newMax) {
        var addIds = [],
            removeIds = [],
            i, len, entry, val;

        for (i = 0, len = this.sortedEntries.length; i < len; i++) {
            entry = this.sortedEntries[i];
            val = entry.value;

            if (val < newMin) {
                
                // remove if previously in range
                if (val >= prevMin && val <= prevMax) {
                    removeIds.push(entry.id);
                }

            } else if (val > newMax) {

                if (val > prevMax) {
                    // past all potential add and removes
                    break;  
                } else if (val >= prevMin) {
                    removeIds.push(entry.id);
                }

            } else {

                // add if wasn't previously in range
                if (val < prevMin || val > prevMax) {
                    addIds.push(entry.id);
                }

            }

        }

        
        if (this.isMultiValue) {

            // need to de-dup if there are multi-values
            addIds = PxFacetSearch.unique(addIds);
            removeIds = PxFacetSearch.unique(removeIds);

            // make sure remove values aren't in range for other value
            for (i = removeIds.length - 1; i >= 0; i--) {
                if (this.idInRange(removeIds[i], newMin, newMax)) {
                    removeIds.splice(i, 1);
                }
            }
        }
        
        return { addIds: addIds, removeIds: removeIds };

    };

    function NumberEntry(value, id) {
        this.value = value;
        this.id = id;
    }

    NumberEntry.sortByValue = function(a, b) {
        if (a.value < b.value) { return -1; }
        if (a.value === b.value) { return 0; }
        return 1;
    };

    PxFacetSearch.RangeColumn = RangeColumn;

})();