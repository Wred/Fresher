var Page = Backbone.Model.extend({
    url: function () {
        return "/rest/page/" + this.get("_id");
    }
});

var Pages = Backbone.Collection.extend({
    model: Page,
    url: "/rest/page"
});
