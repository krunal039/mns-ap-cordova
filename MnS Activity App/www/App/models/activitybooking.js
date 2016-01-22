// create namespace for this project
var mnsap = mnsap || {};
mnsap.models = mnsap.models || {};

// mns activity planner path entity
mnsap.models.activityBooking = function () {
    this.Id = undefined;
    this.ActivityTradingArea = undefined;
    this.ActivityTradingAreaId = undefined;
    this.ActivityBusinessUnit = undefined;
    this.ActivityBusinessUnitId = undefined;
    this.ActivityTitle = undefined;
    this.ActivityDescription = undefined;
    this.ActivityStartDate = undefined;
    this.ActivityEndDate = undefined;
    this.ActivityIsUpdated = undefined;
    this.ActivityUpdatedDate = undefined;
    this.ActivityDuration = undefined;
    this.__metadata = {
        type: 'SP.Data.ActivityBookingListItem'
    };
};