/**
 * Created with JetBrains WebStorm.
 * User: demohn
 * Date: 13-6-5
 * Time: 上午10:18
 * To change this template use File | Settings | File Templates.
 */
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
        description += "更新时间："+IO_Config.UpdateTime+"<br />";
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
        },
        ExecCMD:function(func){
            eval(func);
        }
    }
};
