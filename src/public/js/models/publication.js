var Publication = Backbone.Model.extend();

var Publications = Backbone.Collection.extend({
    model: Publication,
    url: "/rest/publication"
});
