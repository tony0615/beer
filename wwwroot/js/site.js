
$(function () {
    let ww = $(window).width(), hh = $(window).height();
    //let a = $("header").height() || 0, b = $("footer").height() || 0;
    //$(".sf-height").height(hh - a - b);
    $(document).on("change", ".file-movie", movieupload)
})
function movieupload(e) {
    e = e.target;
    var ds = $(e).next(".file-movie-url");
    if (!ds) return;
   
    var date = new Date();
    var nm = "video/" + date.getFullYear() + '' + date.getMonth() + '' + date.getDate() + Math.floor(Math.random() * 1000000);
    
    const data = new FormData();
    data.append('file', e.files[0]);
    data.append('allowSize', 1000);
    gwebmsg("/api/TokenQiniu?key=" + nm, function (x) {
        data.append('token', x.token);
        data.append('key', nm)
        //console.log(x.token)
        $.ajax({
            url: "https://upload-z2.qiniup.com",
            type: "POST",
            data: data,
            dataType: "JSON",
            contentType: false,
            processData: false,
            success: function (r) {
                if (r) {
                    $(ds).val("https://image.szwushu.org/" + r.key);
                } else {
                    Msgbox("上传图片失败");
                }
            }
        })
    })
}
function webmsg(_url, _data, _rvf) {
    $.ajax({
        type: "post",
        url: _url,
        data: _data,
        dataType: 'text',
        success: function (rt) {
            console.log(rt)
            if (rt) {
                try {
                    rt = eval('(' + rt + ')');
                } catch(e) {

                }
                if (_rvf) _rvf(rt);
            }
        },
        complete: function (rx) {
            rx = null;
        }
    });
}
function gwebmsg(_url, _rvf) {
    $.ajax({
        type: "get",
        url: _url,
        dataType: 'text',
        success: function (rt) {
            console.log(rt)
            if (rt) {
                try {
                    rt = eval('(' + rt + ')');
                } catch (e) {

                }
                if (_rvf) _rvf(rt);
            }
        },
        complete: function (rx) {
            rx = null;
        }
    });
}
function Msgbox(i) {
    alert(i);
}