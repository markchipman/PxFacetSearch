(function() {
    
    function MultivalueColumn(name, values, columnType) {
        PxFacetSearch.Column.call(this, name, values, columnType);
        
        // keep track of items with no value
        this.nullIds = [];

        // keep track of whether some items have multiple values
        this.isMultiValue = false;

        createValueIndexes.call(this);
    }

    MultivalueColumn.prototype = Object.create(PxFacetSearch.Column.prototype);
    MultivalueColumn.prototype.constructor = MultivalueColumn;

    function createValueIndexes() {

        var i, len, val;
        for (i = 0, len = this.values.length; i < len; i++) {
            val = this.values[i];
            if (val || val === 0 || val === false) {
                this.indexMultiValue(val, i);
            } else {
                this.nullIds.push(i);
            }
        }
    }

    MultivalueColumn.prototype.indexMultiValue = function(val, id) {
        if (Array.isArray(val)) {

            this.isMultiValue = true;

            // need to index each sub-value
            for (var i = 0, len = val.length; i < len; i++) {
                this.indexSingleValue(val[i], id);
            }

        } else {

            // val contains just a single category
            this.indexSingleValue(val, id);
        }
    };

    PxFacetSearch.MultivalueColumn = MultivalueColumn;

})();