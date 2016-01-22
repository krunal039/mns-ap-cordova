// create namespace for this project
var mnsap = mnsap || {};
mnsap.models = mnsap.models || {};

// mns activity planner path entity
mnsap.models.activityTradingArea = function () {
    this.Id = undefined;
    this.ActivityTradingArea = undefined;
    this.__metadata = {
        type: 'SP.Data.ActivityTradingAreaListItem'
    };
};