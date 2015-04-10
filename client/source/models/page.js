var Model = require("ampersand-model");

module.exports = Model.extend({
    props: {
        _id: 'string',
        name: 'string',
        image: 'string',
        children: 'array'
    },
    url: function () {
        var _id = this.get("_id");
        if (_id) {
            return "/rest/page/" + _id;
        } else {
            return "/rest/page";
        }
    }
});