var Collection = require("ampersand-rest-collection");

module.exports = Collection.extend({
    model: require("./publication.js"),
    url: "/rest/publication"
});