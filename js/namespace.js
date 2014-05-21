var PxFacetSearch = window.PxFacetSearch = {};

PxFacetSearch.initArray = function(array, length, value) {
    for (var i = 0; i < length; i++) {
        array[i] = value;
    }
};

// return the EXCEPT set of two arrays
PxFacetSearch.except = function(a1, a2) {
    a1 = a1 || [];
    a2 = a2 || [];

    var results = [],
        i, len, val;
    for (i = 0, len = a1.length; i < len; i++) {
        val = a1[i];
        if (a2.indexOf(val) === -1) {
            results.push(val);
        }
    }

    return results;
};