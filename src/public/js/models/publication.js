var Publication = Backbone.Model.extend({
    idAttribute: "_id"
});


var Publications = Backbone.Collection.extend({
    model: Publication,
    url: "/rest/publication",
    parse: function (response) {
        return response.payload;
    }
});


var publications = new Publications;

publications.fetch();




// function Publications() {
//     this.items = [];
    
//     this.load = function (cb) {
//         var self = this;
//         $.ajax({
//             url:"/rest/publication",
//             complete:function (data) {
//                 self.items = data.responseJSON.payload;
//                 cb();
//             }
//         });
//     };
// }
