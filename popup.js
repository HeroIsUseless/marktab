var bookmarks = []; // 书签会被放到这里
//书签格式 bookmarks = [{caption='', content=[{title='',url=''},,,]},,,] 
// 书签获取函数
chrome.bookmarks.getTree(function (data) {
    analyseBookMark(data[0].children[0].children, data[0].children[0].title); // 书签树的分析
    //console.log(bookmarks);
});
// 书签分析函数
function analyseBookMark(data, title) {
    var caption = title;
    var content = [];
    for (var child of data) {
        if (Object.prototype.toString.call(child.children) == '[object Array]') { // 如果是个文件夹
            analyseBookMark(child.children, child.title);
        }
        else content.push(child);
    }
    var unit = new Object; unit.caption = caption; unit.content = content;
    bookmarks.push(unit);
};

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
