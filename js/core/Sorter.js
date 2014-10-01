(function() {
    
    // Sorter orders a list of matchids. 
    function Sorter(table) {
        this.table = table;
    }

    Sorter.prototype.sortIds = function(ids) {

        // default sort uses natural order
        return ids;
    };

    PxFacetSearch.Sorter = Sorter;

})();