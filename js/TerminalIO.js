//系统设置变量（全局变量）
var IO_Config = {
    "style": {
        "Output": "Code",
        "Input": "Code",
        "HeadChar": "HeadChar"
    },
    "maxlinenum":0,
    "TerminalMode": "Default",
    "linemode": "SingleLine",
    "ShowSysLog":"no",
    "UpdateTime":"2013-6-5",
    "parent_id": "TerminalShell",
    "iframe_id": "TerminalFrame",
    "wrapi_id": "iframe",
    "parent_all_id": "TerminalAll"
};

var TerminalIO = function (parent_id) {
    function AdjustLength(c) {
        var v = $("#Input_" + c);
        var val = v.val().replace(/[^\x00-\xff]/g, "xx").length + 2;
        v.attr("size", val.toString());
    }

    function AdjustHW(c) {
        var vm = $("#Input_" + c);
        var val = vm.val().split("\n");
        var i;
        var vmilth;
        var maxlth = 0;
        vm.attr("rows", val.length+1);   //行最大
        for (i = 0; i < val.length; i++) {       //找列最大的地方
            vmilth = val[i].replace(/[^\x00-\xff]/g, "xx").length;
            if (vmilth >= maxlth) {
                maxlth = vmilth;
            }
        }
        vm.attr("cols", maxlth + 2);
    }

    function Output(text, css_style_name) {
        var css_style_head = IO_Config.style.HeadChar;
        var cpr = $("#" + parent_id);
        var len = cpr.contents(".Output_" + css_style_head).length;
        var c;
        if(css_style_name==undefined){
            css_style_name=IO_Config.style.Output;
        }
        if (text == (IO_Config.TerminalMode + ">")) {
            c = len + 1;
            cpr.append("<span class=Output_" + css_style_head + " id=Output_Head_" + c + ">" + text + "</span>");
            NavLineNumber().Create(c,"Code");
        } else {
            cpr.append("<span class=Output_" + css_style_name + ">" + text + "</span>");
        }
    }

    return{
        SingleInput: function (css_style_name) {
            var cpr = $("#" + parent_id);
            var len = cpr.contents(".Input_" + css_style_name).length;
            var c = len + 1;
            cpr.append("<input type='text' class=Input_" + css_style_name + " id=Input_" + c + " />");

            $("#Input_" + c).focus()
                .bind("keyup", function () {
                    AdjustLength(c);
                }
            );
        },
        MultiInput: function (css_style_name) {
            var cpr = $("#" + parent_id);
            var len = cpr.contents(".Input_" + css_style_name).length;
            var c = len + 1;
            Output("<br />", IO_Config.style.Output);
            cpr.append("<textarea class=Input_" + css_style_name + " id=Input_" + c + " ></textarea>");

            $("#Input_" + c).focus()
                .bind("keyup", function () {
                    AdjustHW(c);
                }
            );
        },
        Output: function (text, css_style_name) {
            Output(text, css_style_name);
        }
    }
};

//运行terminal的核心
var TerminalCore = function (parent_id) {
    function ReplaceSpecialWords(text) {
        var textstr;
        textstr = text.replace(/</g, "&lt;");
        textstr = textstr.replace(/>/g, "&gt;");
        textstr = textstr.replace(/"/g, "&quot;");
        return textstr;
    }

    return{
        Circulate: function () {
            var txt = "";
            var cmd =new Command(parent_id);
            cmd.OutForeString();
            var pid = $("#" + parent_id);
            var keyc;
            $(document).bind("keydown", function (e) {
                var c = pid.contents(".Input_" + IO_Config.style.Input).length;
                var cid = $("#Input_" + c);
                var io = TerminalIO(parent_id);
                var str = "";
                if (e.which) {
                    keyc = e.which;
                } else if (window.event) {
                    keyc = window.event.keyCode;
                }
                if (IO_Config.linemode == "SingleLine") {
                    if (keyc == 13 && e.ctrlKey!=true) {    //Enter
                        str = cid.val();
                        cid.remove();
                        if (IO_Config.TerminalMode != "Default") {
                            txt = ReplaceSpecialWords(cid.val());
                            io.Output(txt + "<br />", IO_Config.style.Output);
                        } else {
                            io.Output(cid.val() + "<br />", IO_Config.style.Output);
                        }
                        cmd.ResponseCMD(str);
                        cmd.OutForeString();
                    }
                } else if (IO_Config.linemode == "MultiLine") {
                    if (e.ctrlKey == true && e.which == 13) { //C-Enter
                        str = cid.val();
                        cid.remove();
                        if (IO_Config.TerminalMode != "Default") {
                            txt = ReplaceSpecialWords(cid.val());
                            io.Output(txt + "<br />", IO_Config.style.Output);
                        } else {
                            io.Output(cid.val() + "<br />", IO_Config.style.Output);
                        }
                        cmd.ResponseCMD(str);
                        cmd.OutForeString();
                    }
                }
            });
        },
        ProcessInput: function () {
            var pid = $("#" + parent_id);
            var keyc;
            var str = "";
            $(document).bind("keyup", function (e) {
                var c = pid.contents(".Input_" + IO_Config.style.Input).length;
                var cid = $("#Input_" + c);
                var io = TerminalIO(parent_id);
                if (e.which) {
                    keyc = e.which;
                } else if (window.event) {
                    keyc = window.event.keyCode;
                }
                if (IO_Config.linemode == "SingleLine") {
                    if (keyc == 13) {
                        str = cid.val();
                        cid.remove();
                        io.Output(cid.val() + "<br />", IO_Config.style.Output);
                    }
                } else if (IO_Config.linemode == "MultiLine") {
                    if (e.ctrlKey == true && e.shiftKey == true && e.which == 90) {
                        str = cid.val();
                        cid.remove();
                        io.Output(cid.val() + "<br />", IO_Config.style.Output);
                    }
                }
            });
        }
    }
};
//行号处理
var NavLineNumber = function () {
    return{
        Create: function (num, css_style_name) {
            IO_Config.maxlinenum=num;
            var ionum=IO_Config.maxlinenum;
            var i,imax;
            var regnum = /[0-9]+/;
            var resultnum="",spc="";
            var cln = $("#LineNumber");
            var chei;
            var cid = $("#" + IO_Config.parent_id);
            //控制行号的空格数以对齐
            imax=Math.floor(Math.log(ionum)/Math.log(10));
            for(i=0;i<imax+2;i++){
               spc+="&nbsp;";
            }
            cln.html(spc).css("height",cid.css("height"));
            resultnum+=num;
            resultnum+="&nbsp;&nbsp;";
            $("#Output_Head_"+num).prepend("<a name=L"+num+"><span id=LineNumber_" +num +" class=LineNum_" + css_style_name + "></span></a>");
                $("#LineNumber_"+num).html(resultnum);
            cid.css({"width":"100%","overflowX":"hidden"});
        }
    }
};

//terminal的其他控制事件
function AddInputExpendListener() {
    $("#all").bind("mouseenter", function () {
        var cip = $("#" + IO_Config.parent_id);
        var len = cip.contents(".Input_" + IO_Config.style.Input).length;
        document.getElementById("Input_" + len).focus();
    }).bind("mousemove",function(){
            document.getElementById("all").focus();
        });

    $(document).bind("keyup", function () {
        var keyc;
        var cip = $("#" + IO_Config.parent_id);
        var len = cip.contents(".Input_" + IO_Config.style.Input).length;
        document.getElementById("Input_" + len).focus();

        //Tab自动补全
        if (e.which) {
            keyc = e.which;
        } else if (window.event) {
            keyc = window.event.keyCode;
        }
        if(keyc==9){ //TODO 因为Tab成了浏览器的快捷键，所以搞定这事还挺麻烦的～～

        }
    });
}
//用于eval模式的快捷函数
//输出字符
function o(text) {
    var io=TerminalIO(IO_Config.parent_id);
    io.Output(text + "<br />",IO_Config.style.Output);
}
//输入单行字符
//TODO 修正si()的 bug
function si() {
    TerminalIO(IO_Config.parent_id).SingleInput(IO_Config.style.Output);
    TerminalCore(IO_Config.parent_id).ProcessInput();
    TerminalIO(IO_Config.parent_id).Output("<br />", IO_Config.style.Output);
}
