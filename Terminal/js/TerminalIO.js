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
    "parent_id": "TerminalShell",
    "iframe_id": "TerminalFrame",
    "wrapi_id": "iframe",
    "parent_all_id": "TerminalAll"
};

var CommandSet = [
    {"name": "about", "cmd": "About()",
        "helpdes": "关于这个终端。"},
    {"name": "help", "cmd": "HelpCommandAll()",
        "helpdes": "列出命令的帮助。"},
    {"name": "cls", "cmd": "Cls()",
        "helpdes": "清除屏幕。"},
    {"name": "clsall", "cmd": "Clsall()",
        "helpdes": "清除屏幕（包括iframe）"},
    {"name": "clsa", "cmd": "Clsall()",
        "helpdes": "清除屏幕（包括iframe）"},
    {"name": "hide", "cmd": "Hide_iframe()",
        "helpdes": "隐藏iframe"},
    {"name": "show", "cmd": "Show_iframe()",
        "helpdes": "显示iframe"},
    {"name":"echo","cmd":"EchoAnchor(cmdstr)","helpdes":"显示某个行号的内容。"},
    {"name": "sch", "cmd": "SearchInWeb(cmdstr)", "helpdes": "在网页中搜索字符。"},
    {"name": "search", "cmd": "SearchInWeb(cmdstr)", "helpdes": "在网页中搜索字符。"},
    {"name": "link", "cmd": "DirectToLocation(cmdstr)", "helpdes": "打开某个网址。"},
    {"name": "eval", "cmd": "EvalMode().Process(cmdstr, 'I')", "helpdes": "打开JavaScript调试模式。"}
];

var bookmark = [
    {"name": "csdn", "addr": "http://www.csdn.net"},
    {"name": "w3", "addr": "http://www.w3school.com.cn"},
    {"name": "renren", "addr": "http://www.renren.com"},
    {"name": "ckc", "addr": "http://ckc.zju.edu.cn"},
    {"name": "csdn", "addr": "http://www.csdn.net"},
    {"name": "baidu", "addr": "http://www.baidu.com"},
    {"name": "c", "addr": "http://10.77.30.30"},
    {"name": "qscbbs", "addr": "http://www.qsc.zju.edu.cn/apps/editor_bbs/"},
    {"name": "index", "addr": "http://demohn.web-61.com"},
    {"name": "NULL", "addr": "http://www.baidu.com"}
];


function FirstRun(parent_id, iframe_id, wrapi_id) {
    var regnum = /[0-9]+/;
    var cid = $("#" + parent_id);
    var cln = $("#LineNumber").css("width");
    var chei = regnum.exec(cid.css("width")) - regnum.exec(cln) + "px";
    IO_Config.parent_id = parent_id;
    IO_Config.iframe_id = iframe_id;
    IO_Config.wrapi_id = wrapi_id;
    $("#all").css("height", ($(document).height()));
    TerminalCore("TerminalShell").CIRCULATE();
    cid.css("width", chei);
}


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
        vm.attr("rows", val.length);   //行最大
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
        var len = cpr.contents(".Output_" + css_style_name).length;
        var c;
        if (text == (IO_Config.TerminalMode + ">")) {
            c = len + 1;
            cpr.append("<span class=Output_" + css_style_head + " id=Output_Head_" + c + ">" + text + "</span>" +
                "<span class=Output_" + css_style_name + " id=Output_" + c + "></span>");
            NavLineNumber().Create(c,"Code");
        } else {
            document.getElementById("Output_" + len).innerHTML += text;
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
//命令处理
var Command = function (parent_id) {
    var cmdstr;
    var inputstr = "";
    var io = TerminalIO(parent_id);
    var wrapi = $("#" + IO_Config.wrapi_id);
    //显示iframe
    function Show_iframe() {
        if (wrapi.css("display") == "none") {
            var ai = $("#" + IO_Config.wrapi_id);
            ai.css("display", "block");
            $("#" + IO_Config.parent_all_id).css("height", "15%");
        }
    }

    //隐藏iframe
    function Hide_iframe() {
        if (wrapi.css("display") == "block") {
            $("#" + IO_Config.wrapi_id).css("display", "none");
            $("#" + IO_Config.iframe_id).attr("src", "");
            $("#" + IO_Config.parent_all_id).css("height", "100%");
        }
    }

    /*给予帮助信息*/
    function HelpCommandAll() {
        var j;
        for (j = 0; j < CommandSet.length; j++) {
            io.Output(CommandSet[j].name + "&nbsp;&nbsp;" + CommandSet[j].helpdes + "<br />", IO_Config.style.Output);
        }
    }

    /*命令文本输出*/
    function Command() {
        io.Output(IO_Config.TerminalMode + ">", IO_Config.style.Output);
        if (IO_Config.linemode == "SingleLine") {
            io.SingleInput(IO_Config.style.Input);
        } else if (IO_Config.linemode == "MultiLine") {
            io.MultiInput(IO_Config.style.Input);
        }
    }

    /*执行终端命令*/
    function ResponseCommand() {
        var i;
        var isIn = 0;
        cmdstr = inputstr.split(" ");
        if (IO_Config.TerminalMode == "Default") {
            for (i = 0; i < CommandSet.length; i++) {
                if (cmdstr[0] == CommandSet[i].name) {
                    eval(CommandSet[i].cmd);
                    isIn = 1;
                    break;
                }
            }
            if (isIn == 0) {
                UnknownCommand();
            }
        } else if (IO_Config.TerminalMode == "Eval") {
            new EvalMode().Process(cmdstr, "P", inputstr);
        }
    }

    /*以下都是终端命令的内容*/
    /*关于*/
    function About() {
        var description;
        description = "我的终端<br />";
        description += "HnTerminal<br />";
        description += "作者：卢名川<br />";
        description += "版本号：2.1<br />";
        description += "更新时间：2013-4-26<br />";
        io.Output(description + "<br />", IO_Config.style.Output);
    }

    /*跳转到某个行号中去*/
    function EchoAnchor(msg) {
        var regnum=/[0-9]+/;
        var num=1;
        if(regnum.test(msg[1])==true){
            num=regnum.exec(msg[1]);
            io.Output("<br />"+$("#Output_"+num).html()+"<br />",IO_Config.style.Output);
        }
    }
    /*清屏*/
    function Cls() {
        $("#" + parent_id).empty();
        $("#LineNumber").empty();
    }

    /*全面清屏*/
    function Clsall() {
        $("#" + parent_id).empty();
        Hide_iframe();
    }

    /*无法解析时报错*/
    function UnknownCommand() {
        var description;
        description = "字符串" + "\"" + cmdstr[0] + "\"" + "无法被解读，请确认所输入的命令无误。<br />";
        io.Output(description + "<br />", IO_Config.style.Output);
    }

    /*启动搜索引擎*/
    function SearchInWeb(msg) {
        var regBaidu = /^-b$/;
        var regGoogle = /^-g$/;
        var regDuckDuckGo = /^-d$/;
        var j;
        var schmsg = "";
        if (msg.length == 1) {
            io.Output("请打入要搜索的文字<br />", IO_Config.style.Output);
        } else if (regBaidu.test(msg[1]) == true) {
            for (j = 2; j < msg.length; j++) {
                schmsg = schmsg + msg[j] + " ";
            }
            $("#" + IO_Config.iframe_id).attr("src", "http://www.baidu.com/s?wd=" + schmsg);
            Show_iframe();
        } else if (regGoogle.test(msg[1]) == true) {
            for (j = 2; j < msg.length; j++) {
                schmsg = schmsg + msg[j] + " ";
            }
            $("#" + IO_Config.iframe_id).attr("src", "https://www.google.com.hk/search?newwindow=1&safe=active&site=&source=hp&q=" + schmsg + "&btnG=Search");
            Show_iframe();
        } else if (regDuckDuckGo.test(msg[1]) == true) {
            for (j = 2; j < msg.length; j++) {
                schmsg = schmsg + msg[j] + " ";
            }
            $("#" + IO_Config.iframe_id).attr("src", "https://duckduckgo.com/?q=" + schmsg);
            Show_iframe();
        } else {
            for (j = 1; j < msg.length; j++) {
                schmsg = schmsg + msg[j] + " ";
            }
            $("#" + IO_Config.iframe_id).attr("src", "http://www.baidu.com/s?wd=" + schmsg);
            Show_iframe();
        }
    }

    /*跳转到某个页面*/
    function DirectToLocation(str) {
        var regMark = /^\\(\w+)/;
        var resMark;
        var linkpage = "";
        var i, isCaught = 0;

        /**
         *
         * @param json
         * @constructor
         */
        function ShowAllLinks(json) {
            var k;
            io.Output("所有书签列表：<br />", IO_Config.style.Output);
            for (k = 0; k < json.length; k++) {

                io.Output(json[k].name + "&nbsp;&nbsp;&nbsp;&nbsp;" + json[k].addr + "<br />", IO_Config.style.Output);
            }
        }

        if (str.length == 1) {
            io.Output("请输入有效网址或者书签！<br />", IO_Config.style.Output);
        } else {
            if (regMark.test(str[1]) == true) {
                resMark = RegExp.$1;
                for (i = 0; i < bookmark.length; i++) {
                    if (bookmark[i].name == resMark) {
                        linkpage = bookmark[i].addr;
                        isCaught = 1;
                        break;
                    }
                }
                if (isCaught == 0) {
                    linkpage = bookmark[bookmark.length - 1].addr;
                }
                $("#" + IO_Config.iframe_id).attr("src", linkpage);
                Show_iframe();
            } else if (str[1] == "-b") {
                new ShowAllLinks(bookmark);
            } else {
                $("#" + IO_Config.iframe_id).attr("src", "http://" + str[1]);
                Show_iframe();
            }
        }
    }


    return{
        OutForeString: function () {
            Command();
        },
        ResponseCMD: function (str) {
            inputstr = str;
            ResponseCommand();
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
        CIRCULATE: function () {
            var txt = "";
            var cmd = Command(parent_id);
            cmd.OutForeString();
            var pid = $("#" + parent_id);
            var keyc;
            $(document).bind("keyup", function (e) {
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
                    if (keyc == 13) {
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
                    if (e.ctrlKey == true && e.shiftKey == true && e.which == 90) {
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
        PROCESSINPUT: function () {
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
            chei =regnum.exec($("#all").css("width")) - regnum.exec(cln.css("width")) + "px";
            cid.css("width", chei);
        }
    }
};
//terminal的其他控制事件
function AddTerminalEventListener() {
    $("#all").bind("mouseenter", function () {
        var cip = $("#" + IO_Config.parent_id);
        var len = cip.contents(".Input_" + IO_Config.style.Input).length;
        document.getElementById("Input_" + len).focus();
    }).bind("mousemove",function(){
            document.getElementById("all").focus();
        });

    $(document).bind("keydown", function () {
        var cip = $("#" + IO_Config.parent_id);
        var len = cip.contents(".Input_" + IO_Config.style.Input).length;
        document.getElementById("Input_" + len).focus();
    });
}
//用于eval模式的快捷函数
//输出字符
function o(text) {
    var io=TerminalIO(IO_Config.parent_id);
    io.Output(text + "<br />");
}
//输入单行字符
function si() {
    TerminalIO(IO_Config.parent_id).SingleInput(IO_Config.style.Output);
    TerminalCore(IO_Config.parent_id).PROCESSINPUT();
    TerminalIO(IO_Config.parent_id).Output("<br />", IO_Config.style.Output);
}
