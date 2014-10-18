function Publications() {
    this.items = [];
    
    this.load = function (cb) {
        var self = this;
        $.ajax({
            url:"/publications",
            complete:function (data) {
                self.items = data.responseJSON;
                cb();
            }
        });
    };
}
