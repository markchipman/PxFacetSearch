(function() {
    
    PxFacetSearch.ColumnType = {
        none: 'none',
        category: 'category',
        range: 'range'
    };

    // Columns store data for a single property. No indexing in basic column.

    function Column(name, values, columnType) {
        this.type = columnType || PxFacetSearch.ColumnType.none;
        this.name = name;
        this.values = values;
    }

    PxFacetSearch.Column = Column;

})();