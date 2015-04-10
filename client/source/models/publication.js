var Model = require("ampersand-model");

module.exports = Model.extend({
    props: {
        _id: 'string',
        name: 'string',
        rootPage: 'string'
    }
});