chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(request);
        //alert(request);
        var img = document.createElement('img');           // 新建一个img
        img.src = String(request);
        img.onload = function () {                         // 在图片加载完后立即执行
            var canvas = document.createElement('canvas'); // 新建一个canvas
            canvas.width = img.width;                      // 这个img是base64数据，也就是包含了全部信息了
            canvas.height = img.height;                    // 通过信息确定宽高
            var context = canvas.getContext("2d");         // 一些设置
            context.drawImage(img, 0, 0);                  // 开始画，把这个img画进去
            var dataUrl = canvas.toDataURL('image/png', 0.75); // 参数为图片格式，图片质量
            // 返回包含dataURI的DOMString，也就是该画布对应的字符串base64数据
            console.log('zws 6352', dataUrl)
            sendResponse({ data: dataUrl }); // 这个cb是一个函数，直接传出去img的信息
        };
        return true;
    }
);

// chrome.contextMenus.create({
//     title: "测试单",
//     onclick: function () { alert('您点击单！'); }
// });