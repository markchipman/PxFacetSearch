(function() {
    
    // Selectors provide data for Selection UI

    function CategorySelector(name, query) {
        this.name = name;
        this.dirty = true;

        this.query = query;
        this.query.onUpdate(onQueryUpdate.bind(this));

        // keep track of available choices
        this.choices = [];
        this.nullCount = 0;
        this.choiceSortCompare = this.compareChoicesByCount;

        // initialize choices
        var column = this.query.table.getColumn(this.name),
            potentialValues = column.getPotentialValues(),
            i, len, value;
        for (i = 0, len = potentialValues.length; i < len; i++) {
            value = potentialValues[i];
            if (value !== null) {
                this.choices.push({ 
                    value: value, 
                    count: 0, 
                    selected: true 
                });
            }
        }
    }

    function updateChoiceCounts() {
        
        var choicesByValue = {},
            column = this.query.table.getColumn(this.name),
            values = column.values,
            localMatches = this.query.getFilterMatches(this.name),
            blockCounts = this.query.blockCounts,
            i, j, globalBlocks, value, choice;

        var incrementChoiceCount = function(value) {
            if (choicesByValue[value]) {
                choicesByValue[value]++;
            } else {
                choicesByValue[value] = 1;
            }
        };

        this.nullCount = 0;

        // bucket all the choices for valid results
        for (i = values.length; i--; ) {

            globalBlocks = blockCounts[i];
            if (globalBlocks !== 0 &&
                ((globalBlocks === 1 && localMatches[i]) || globalBlocks > 1)) {
                // blocked by at least one other filter
                continue;
            }

            // count null values separately
            value = values[i];
            if (value === null) {
                this.nullCount++;
                continue;
            }

            // increment the bucket count
            if (Array.isArray(value)) {
                for (j = 0; j < value.length; j++) {
                    incrementChoiceCount(value[j]);
                }
            } else {
                incrementChoiceCount(value);
            }
        }

        // update choice counts
        for (i = this.choices.length; i--; ) {
            choice = this.choices[i];
            choice.count = choicesByValue[choice.value] || 0;
        }

        // sort choices (typically most common first)
        this.choices.sort(this.choiceSortCompare);

        this.dirty = false;
    }

    CategorySelector.prototype.compareChoicesByCount = function(a, b) {
        if (a.count > b.count) { return -1; }
        if (a.count < b.count) { return 1; }
        return 0;
    };

    CategorySelector.prototype.compareChoicesByValue = function(a, b) {
        if (a.value < b.value) { return -1; }
        if (a.value > b.value) { return 1; }
        return 0;
    };

    function onQueryUpdate(sourceName) {
        // UI selections don't change if user made a local selection
        if (this.name !== sourceName) {
            this.dirty = true;
        }
    }

    CategorySelector.prototype.getChoices = function() {

        if (this.dirty) {
            updateChoiceCounts.call(this);
        }

        return this.choices;
    };

    CategorySelector.prototype.getChoice = function(value) {

        var choices = this.getChoices(),
            i, len, choice;

        for (i = 0, len = choices.length; i < len; i++) {
            choice = choices[i];
            if (choice.value === value) {
                return choice;
            }
        }

        return null;
    };    

    CategorySelector.prototype.toggle = function(value, isSelected) {

        var i, len, choice;
        for (i = 0, len = this.choices.length; i < len; i++) {
            choice = this.choices[i];
            if (choice.value === value) {

                if (isSelected === true || isSelected === false) {
                    choice.selected = isSelected;
                } else {
                    choice.selected = !choice.selected;
                }

                break;
            }
        }

        setFilterSelections.call(this);
    };

    CategorySelector.prototype.select = function(values) {

        var i, len, choice;
        for (i = 0, len = this.choices.length; i < len; i++) {
            choice = this.choices[i];
            choice.selected = (values.indexOf(choice.value) !== -1);
        }

        setFilterSelections.call(this);
    };

    CategorySelector.prototype.reset = function(value) {

        var i, len;
        for (i = 0, len = this.choices.length; i < len; i++) {
            this.choices[i].selected = true;
        }

        setFilterSelections.call(this);
    };

    // private method to set filter selections based on current choices
    function setFilterSelections() {

        var selections = [],
            i, len, choice;
        for (i = 0, len = this.choices.length; i < len; i++) {
            choice = this.choices[i];
            if (choice.selected) {
                selections.push(choice.value);
            }
        }

        // add null if every other value is selected
        if (selections.length === this.choices.length) {
            selections.push(null);
        }

        this.query.select(this.name, selections);
    }


    PxFacetSearch.CategorySelector = CategorySelector;

})();