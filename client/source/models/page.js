var Model = require("ampersand-model");

module.exports = Model.extend({
    url: function () {
        var _id = this.get("_id");
        if (_id) {
            return "/rest/page/" + _id;
        } else {
            return "/rest/page";
        }
    }
});