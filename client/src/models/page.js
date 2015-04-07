var Backbone = require("backbone");

module.exports = Backbone.Model.extend({
    url: function () {
        var _id = this.get("_id");
        if (_id) {
            return "/rest/page/" + _id;
        } else {
            return "/rest/page";
        }
    }
});