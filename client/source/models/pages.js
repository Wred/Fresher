var Collection = require("ampersand-rest-collection");

module.exports = Collection.extend({
    model: require("./page.js"),
    url: "/rest/page"
});
