var Backbone = require("backbone");

module.exports = Backbone.Collection.extend({
    model: require("./page.js"),
    url: "/rest/page"
});
