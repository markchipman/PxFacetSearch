(function() {
    
    function CategorySelectorUI(selector) {
        this.selector = selector;
        this.choiceData = this.selector.getChoices();
        this.selectionCount = this.choiceData.length;
        this.renderChoices();
    }

    CategorySelectorUI.prototype.updateData = function() {
        this.choiceData = this.selector.getChoices();
        this.renderChoices();
    };

    CategorySelectorUI.prototype.toggleChoice = function(value) {

        if (this.selectionCount === this.choiceData.length) {
            // make a single selection
            this.selector.select([value]);
            this.selectionCount = 1;
        } else {

            var choice = this.selector.getChoice(value);
            if (choice) {
                if (this.selectionCount === 1 && choice.selected) {
                    // once everything has been de-selected, we revert
                    // back to selecting everything
                    this.selector.reset();
                    this.selectionCount = this.choiceData.length;
                } else {
                    // only toggle the single value
                    this.selector.toggle(value);
                    this.selectionCount += choice.selected ? -1 : 1;    
                }
            }
        }
    };
    
    CategorySelectorUI.prototype.clearSelections = function() {
        this.selector.reset();
        this.selectionCount = this.choiceData.length;
        this.renderChoices();
    };

    PxFacetSearch.CategorySelectorUI = CategorySelectorUI;

})();