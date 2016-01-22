// create namespace for this project
var mnsap = mnsap || {};
mnsap.models = mnsap.models || {};

// mns activity planner path entity
mnsap.models.activityBusinessArea = function () {
    this.Id = undefined;
    this.ActivityBusinessUnit = undefined;
    this.__metadata = {
        type: 'SP.Data.ActivityBusinessAreaListItem'
    };
};