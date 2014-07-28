(function() {

    // stores columns for a collection of items
    function Table() {
        this.columns = [];
        this.columnsByName = {};

        this.itemCount = 0;
    }

    Table.prototype.addColumn = function(column) {
        this.columns.push(column);
        this.columnsByName[column.name] = column;
        this.itemCount = column.values.length;
    };

    Table.prototype.getColumn = function(columnName) {
        return this.columnsByName[columnName];
    };

    Table.prototype.getValue = function(columnName, id) {
        var column = this.columnsByName[columnName];
        return column ? column.values[id] : undefined;
    };
    
    PxFacetSearch.Table = Table;

})();