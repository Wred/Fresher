var Model = require("ampersand-model");

module.exports = Model.extend({
    props: {
        _id: '_id',
        name: 'string',
        image: 'string'
    }
});