//书签格式 bookmarks = [{caption='', content=[{title='',url=''},,,]},,,] 
var bookmarks = []; // 所有的书签

// 书签获取
chrome.bookmarks.getTree(function (data) {
    analyseBookMark(data[0].children[0].children, data[0].children[0].title); // 书签树的分析
    //console.log(bookmarks);
    $("#content").append(toHTML(bookmarks));
    $('.del_bt').click(function () {
        chrome.bookmarks.remove($(this).attr('id'), function () { // 书签删除函数及其回调
            window.location.reload();
            alert("delete sucess");
        });
    })
});

favicon = (pageUrl, size) => {
    if (!size) size = 24;
    const url = new URL(`chrome-extension://${chrome.runtime.id}/_favicon/`);
    url.searchParams.append("pageUrl", pageUrl);
    url.searchParams.append("size", size.toString());
    return url.href;
};

// 书签分析函数，返回flat列表，数据放在bookmarks里面
function analyseBookMark(data, title) {
    var caption = title;
    var content = [];
    for (var child of data) {
        if (Object.prototype.toString.call(child.children) == '[object Array]') { // 如果是个书签夹
            analyseBookMark(child.children, child.title);
        }
        else content.push(child);
    }
    var unit = new Object;
    unit.caption = caption;
    unit.content = content;
    bookmarks.push(unit);
};

function toHTML(bookmarks) { // 书签转换成HTML
    var HTML = '';
    for (var folder of bookmarks) {
        HTML += '<div class="h">' + folder.caption + '</div>';
        for (var item of folder.content) {
            getImg(item);
            var im = '<img class="im" src="' + favicon(item.url) + '" href="' + item.url + '" ></img>';
            var tit = '<a class="tit" href="' + item.url + '">' + item.title + '</a>';
            var del = '<div class="del_bt" id="' + item.id + '"></div>';
            HTML += '<div class="bt">'
                + im + tit + del
                + '</div>';
        }
    }
    return HTML;
}

$(document).ready(function () {
    // 书签搜索器
    $("#search-box").bind("input propertychange", search);

    $("#search-box").focus(search);
    $("#search-box").blur(function () {
        setTimeout(function () { $("#search-content").html('') }, 200); // 延迟200毫秒防止消失
    })

    function search() {
        $("#search-content").css('top', $("#search-box").height());
        var text = $("input").val();
        $("#search-content").html('');
        if (text != '') {
            for (var folder of bookmarks) {
                for (var item of folder.content) {
                    var flag = false;
                    if (text.length == 1) {
                        var ch = text.charAt(0).toLowerCase();
                        if (item.title.toLowerCase().indexOf(ch) != -1) flag = true;
                    }
                    else {
                        for (var i = 0; i < text.length - 1; i++) {
                            var ch = text.charAt(i).toLowerCase() + text.charAt(i + 1).toLowerCase();
                            if (item.title.toLowerCase().indexOf(ch) != -1) flag = true;
                        }
                    }
                    if (flag) {
                        var im = '<img class="im" src="chrome://favicon/' + item.url + ' " href="' + item.url + '"/>';
                        var tit = '<a class="item_title" href="' + item.url + '">' + item.title + '</a>';
                        var str = "<div class='search_item' href='" + item.url + "'>"
                            + im
                            + tit
                            + "</div>";
                        $("#search-content").append(str);
                    }
                }
            }
        }
    }
});

// 消息传递函数
function getImg(item) {
    chrome.runtime.sendMessage("chrome://favicon/"+item.url, function (response) { // 第二个参数是callback
        //console.log('收到来自后台的回复：' + String(response.data));
        var img = document.createElement('img'); // 又新建了一个img
        img.style.width = "16px";                // 嗯进行参数设置
        img.style.height = "16px";
        img.style.paddingBottom = "6px";
        console.log('zws 5635', img, response)
        return
        img.src = response.data;                 // src直接返回是url，不是uri
        //$("#main").append(img);
    });
}
var height = document.body.clientHeight;
$("#main").css("min-height", height + "px");
$("footer").css("opacity", "1");
var title = chrome.i18n.getMessage("extName");
// console.log(title);
