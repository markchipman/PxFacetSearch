(function() {

    // manages selectors driving a query targeting a table    
    function View(table) {
        this.table = table;
        
        this.query = new PxFacetSearch.Query(table);

        // create selectors for all of the filters
        this.selectors = [];
        this.selectorsByName = {};

        var i, len, filter, selector;
        for (i = 0, len = this.query.filters.length; i < len; i++) {
            filter = this.query.filters[i];
            if (filter.column.type === PxFacetSearch.ColumnType.category) {
                selector = new PxFacetSearch.CategorySelector(filter.name, this.query);
                this.selectors.push(selector);
                this.selectorsByName[filter.name] = selector;
            }
        }

        // NOTE: we add our update callback after creating the selectors
        // (which also listen to query updates). That means we get called
        // after all the selctors have been updated
        this.query.onUpdate(onQueryUpdate.bind(this));
    }

    function onQueryUpdate(sourceName) {
        // TODO: set pageIndex = 0;
    }

    View.prototype.getSelector = function(columnName) {
        return this.selectorsByName[columnName];
    };

    PxFacetSearch.View = View;

})();