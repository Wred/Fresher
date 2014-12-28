// My attempt to fix some Backbone peeves

Backbone.Model.prototype.idAttribute = "_id";

Backbone.Model.prototype.parse = function (response) {
    if (response.hasOwnProperty("_id")) {
        // AM: NOTE: Backbone:
        // this parse was called after loading an entire collection.
        return response;
    }

    if (response.status) {
        console.error("Error retrieving JSON from server:\n" + response);
        // AM: NOTE: Backbone:
        // should have a way to handle the error here...
        return null;
    }

    return response.payload;
};

Backbone.Collection.prototype.parse = function (response) {
    if (response.status) {
        console.error("Error retrieving JSON from server:\n" + response);
        // AM: NOTE: Backbone:
        // should have a way to handle the error here...
        return null;
    } else {
        return response.payload;
    }
};


// AM: NOTE: Backbone:
// Creating my own get method that will fetch if we don't
// already have the model and add it to the collection

Backbone.Collection.prototype.getFetch = function (id, cb) {
    // AM: NOTE: Backbone:
    // If I don't have it, just get it from the server.
    // and make this call async...
    var self = this,
        _model = self.get(id);

    if (_model) {
        cb(_model.attributes);
    } else {
        _model = new self.model({_id:id});
        _model.fetch({
            success: function (model, response, options) {
                self.add(model);
                cb(model.attributes);
            },
            error: function (model, response, options) {
                console.error("Couldn't load page:\n"+ response);
            }
        })
    }
};