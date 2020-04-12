/**
 * 使用bootbox的弹出选择对话框
 * 数据提供方式，json：必须有value和text属性
 var data = njs.Select(nj => new {value = nj, text = nj});
 return Json(data, JsonRequestBehavior.AllowGet);

 function selectbox_teacher(tovalue, totext) {
        bootselector("教师选择",
            [{
                label: "部门", // 显示的标签
                name: "depId", // 设置为input的name，用于form提交，传递给Server的参数值
                url: '@Url.Action("GetDepartments", "Department", new {area = "Account"})'
            },
            {
                label: "教师",
                name: "shi",
                url: '@Url.Action("GetTeachers", "Teachers", new {area = "Account"})'
            }],
            function (value, text) {
                $("#" + tovalue).val(value);
                $("#" + totext).val(text);
            });
    }

 */
function initFirstSelect(option) {
    $.post(option.url,
    {},
    function (data) {
        var odata = eval(data);
        var first = $("#select-0");
        first.append("<option value=''>请选择</option>");
        for (var i in odata) {
            var o = "<option value='" + odata[i].value + "'>" + odata[i].text + "</option>";
            first.append(o);
        }
    },
    "json");
    $("button[data-bb-handler='main']").attr("disabled", "disabled");
}

function selectionChange(obj) {
    var form = $(obj).parents("form");
    var no = parseInt($(obj).attr("data-no")) + 1;
    var to = $("#select-" + no);
    var url = to.attr("data-url");
    to.empty();
    to.change();
    $("button[data-bb-handler='main']").attr("disabled", "disabled");
//    var ss = $("div[data-bbs='data-bbs'] select");
//    for (var i = no; i < ss.length; i++) {
//        $(ss[i]).empty();
//    }
    if (obj.value == "") {
        return;
    }
    $.post(url,
        form.serialize(),
        function (data) {
            var odata = eval(data);
            to.append("<option value='' selected>请选择</option>");
            for (var i in odata) {
                var o = "<option value='" + odata[i].value + "'>" + odata[i].text + "</option>";
                to.append(o);
            }
        },
        "json");
}

function lastSelectChange(obj) {
    if (obj.valueOf != "") {
        $("button[data-bb-handler='main']").removeAttr("disabled");
    }
}

function bootselector(title, options, callback) {
    var tmplate = $('<div></div>');
    for (var i = 0; i < options.length - 1; i++) {
        var o = options[i];
        tmplate.append(
            '<div class="form-group row">' +
            '<label class="control-label col-md-2">' + o.label + '</label>' +
            '<div class="col-md-8">' +
			// id 用于jquery做选择器， name用于form提交, data-no 当前select的序号，下一个是data-no + 1, data-url 获取数据的url
            '<select id="select-' + i + '" name="' + o.name + '" class="form-control" data-no="' + i + '" data-url="' + o.url + '" onchange="selectionChange(this)"></select>' +
            '</div>' +
            '</div>');
    }
    o = options[i];
    tmplate.append(
        '<div class="form-group row">' +
        '<label class="control-label col-md-2">' + o.label + '</label>' +
        '<div class="col-md-8">' +
        '<select id="select-' + i + '" name="select-' + i + '" class="form-control" data-no="' + i + '" data-url="' + o.url + '" onchange="lastSelectChange(this)"></select>' +
        '</div>' +
        '</div>');

    bootbox.dialog({
        message: '<form><div data-bbs="data-bbs" class="form-horizontal">' + tmplate.html() + '</div></form>',
        title: title,
        buttons: {
            cancel: {
                label: "取消",
                className: "btn-default",
            },
            main: {
                label: "确定",
                className: "btn-primary",
                callback: function () {
                    var s = $("#select-" + (options.length - 1));
                    var value = s.val();
                    var text = s.find("option:selected").text();
                    var vals = [];
                    for (var j = 0; j < options.length; j++) {
                        var ss = $("#select-" + j);
                        var v = {
                            value: ss.val(),
                            text: ss.find("option:selected").text()
                        };
                        vals.push(v);
                    }
                    callback(value, text, vals);
                } // end callback
            } // end button main
        } // end buttons
    });
    initFirstSelect(options[0]);
}