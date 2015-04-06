function Config(cb) {
    $.ajax({
        url:"/rest/config",
        complete:function (data) {
            cb(data.responseJSON.payload[0]);
        }
    });
}