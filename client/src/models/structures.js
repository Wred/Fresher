var Backbone = require("backbone");

module.exports = Backbone.Collection.extend({
    model: require("./structure.js"),
    url: "/rest/structure"
});
