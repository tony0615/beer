class UploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }
    upload() {
        return new Promise((resolve, reject) => {
            if (Config_UploadImage == "local") {
                try {
                    let file = this.loader.file;
                    //let URL = window.URL || window.webkitURL;
                    //let blob = URL.createObjectURL(file);
                    
                    if (window.FileReader) {
                        let reader = new FileReader();
                        //resolve({ default: reader.readAsDataURL(file) });

                        reader.onload = function (event) {
                            let base64;
                            let img = new Image();
                            img.src = event.target.result;

                            img.onload = function () {

                                let that = this;
                                let w = that.width, h = that.height, scale = w / h;
                                w = Config_UploadImage_width || w;
                                h = w / scale;

                                let canvas = document.createElement('canvas');
                                let ctx = canvas.getContext('2d');
                                $(canvas).attr({
                                    width: w,
                                    height: h
                                });
                                ctx.drawImage(that, 0, 0, w, h);
                                base64 = canvas.toDataURL('image/jpeg', Config_UploadImage_quality || 0.8);
                                console.log("Image:" + base64);
                                resolve({ default: base64 });
                            }
                        }
                        try {
                            reader.readAsDataURL(file);
                        } catch (e) {}
                    } else {
                        let date = new Date();

                        let nm = date.getFullYear() + '' + date.getMonth() + '' + date.getDate() + Math.floor(Math.random() * 1000000);

                        let data = new FormData();
                        data.append('file', this.loader.file);
                        data.append('asize', 10);
                        $.ajax({
                            url: "/api/UploadImage?sfz=" + nm,
                            type: "POST",
                            data: data,
                            dataType: "JSON",
                            contentType: false,
                            processData: false,
                            success: function (r) {
                                console.log(r);
                                if (r) {
                                    resolve({ default: "/imgs/" + r.key });
                                } else {
                                    reject("上传图片失败");
                                }
                            }
                        })
                    }
                } catch (e) {
                    //console.log(e);
                }
            } else {
                var date = new Date();

                var nm = date.getFullYear() + '' + date.getMonth() + '' + date.getDate() + Math.floor(Math.random() * 1000000);

                const data = new FormData();
                data.append('file', this.loader.file);
                data.append('allowSize', 10);
                gwebmsg("/api/TokenQiniu?Key=" + nm, function (x) {
                    data.append('token', x);
                    $.ajax({
                        url: "https://upload-z2.qiniup.com",
                        type: "POST",
                        data: data,
                        dataType: "JSON",
                        contentType: false,
                        processData: false,
                        success: function (r) {
                            if (r) {
                                resolve({ default: "https://image.szwushu.org/"+r.key });
                            } else {
                                reject("上传图片失败");
                            }
                        }
                    })
                })
            }
        });
    }
}