var Collection = require("ampersand-rest-collection");

module.exports = Collection.extend({
    model: require("./structure.js"),
    url: "/rest/structure"
});
