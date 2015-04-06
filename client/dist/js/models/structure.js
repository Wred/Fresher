var Structure = Backbone.Model.extend();

var Structures = Backbone.Collection.extend({
    model: Structure,
    url: "/rest/structure"
});
