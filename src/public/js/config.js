function Config(cb) {
    $.ajax({
        url:"/config",
        complete:function (data) {
            cb(data.responseJSON);
        }
    });
}