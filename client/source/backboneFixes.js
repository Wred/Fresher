// My attempt to fix some Backbone peeves
var Model = require("ampersand-model"),
	Collection = require("ampersand-rest-collection");

Model.prototype.idAttribute = "_id";

Model.prototype.parse = function (response) {
    if (response.hasOwnProperty("_id")) {
        // AM: NOTE: Backbone:
        // this parse was called after loading an entire collection.
        return response;
    }

    if (response.status) {
        console.error("Error retrieving JSON from server:\n\t" + response.error);
        // AM: NOTE: Backbone:
        // should have a way to handle the error here...
        return null;
    }

    return response.payload;
};


// do our own save function with a single callback
Model.prototype.cbSave = function (attributes, cb) {

    var jqXHR = this.save(attributes, {wait:true});

    if (!jqXHR) {
        // failed validation
        return cb("Failed validation");
    }

    // otherwise we made it
    jqXHR
        .fail(function (jqXHR, textStatus, errorThrown) {
            cb(errorThrown);
        })
        .done(function (data, textStatus, jqXHR) {
            cb(null, data);
        });
}


Collection.prototype.parse = function (response) {
    if (response.status) {
        console.error("Error retrieving JSON from server:\n" + response);
        // AM: NOTE: Backbone:
        // should have a way to handle the error here...
        return null;
    } else {
        return response.payload;
    }
};



Collection.prototype.cbFetch = function (cb) {
	this.fetch({
		error: function (collection, response, options) {
		    cb(response);
		},		
		success: function (collection, response, options) {
		    cb(null, collection);
		}
	});
}