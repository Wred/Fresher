function Publications() {
    this.items = [];
    
    this.load = function (cb) {
        var self = this;
        $.ajax({
            url:"/rest/publication",
            complete:function (data) {
                self.items = data.responseJSON;
                cb();
            }
        });
    };
}
