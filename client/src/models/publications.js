var Backbone = require("backbone");

module.exports = Backbone.Collection.extend({
    model: require("./publication.js"),
    url: "/rest/publication"
});