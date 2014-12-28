// My attempt to fix some Backbone peeves

Backbone.Model.prototype.idAttribute = "_id";

Backbone.Model.prototype.parse =
    function (response) {
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

Backbone.Collection.prototype.parse = 
    function (response) {
        if (response.status) {
            console.error("Error retrieving JSON from server:\n" + response);
            // AM: NOTE: Backbone:
            // should have a way to handle the error here...
            return null;
        } else {
            return response.payload;
        }
    };
