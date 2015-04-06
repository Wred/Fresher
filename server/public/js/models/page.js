var Page = Backbone.Model.extend({
    url: function () {
        var _id = this.get("_id");
        if (_id) {
            return "/rest/page/" + _id;
        } else {
            return "/rest/page";
        }
    }
});

var Pages = Backbone.Collection.extend({
    model: Page,
    url: "/rest/page"
});
