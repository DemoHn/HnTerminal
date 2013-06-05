var EvalMode = function () {
    var c;
    var io = new TerminalIO(IO_Config.parent_id);
    /*eval模式下进行管理*/
    function EvalProcess(cmdstr, mode, inputstr) {
        if (mode == "I") {
            if (cmdstr[1] == "-m") {
                IO_Config.linemode = "MultiLine";
            }
            IO_Config.TerminalMode = "Eval";
            EvalWelcome();
        } else if (mode == "P") {
            switch (cmdstr[0]) {
                case "quit":
                    IO_Config.TerminalMode = "Default";
                    IO_Config.linemode = "SingleLine";
                    break;
                case "clear":
                case "cls":
                    $("#" + IO_Config.parent_id).empty();
                    break;
                case "help":
                    io.Output("知道这个为什么叫edition 2吗？因为它很2~~~~<br />",IO_Config.style.Output);
                    break;
                default:
                    Eval();
            }
        }
        /*对Eval模式的介绍*/
        function EvalWelcome() {
            var description;
            description = "您已进入Eval模式！<br />";
            description += "eval函数是JavaScript里面用于将字符串变成JavaScript语句来执行的函数。<br />";
            description += "从理论上讲，它可以做任何事情。<br />";
            description += "输入\"help\"查看更多内容，输入\"quit\"以退出<br />";
            io.Output(description + "<br />", IO_Config.style.Output);
        }

        /*对特殊字符串进行处理*/

        /*Eval Core*/
        function Eval() {
            var result = "";
            try {
                result = eval(inputstr);
            } catch (expectation) {
                io.Output("<br />出错了！<br />错误信息：<br />" + expectation, IO_Config.style.Output);
            } finally {
                var len=$(".vir_terminal").contents().length;
                c=len+1;
                io.Output("<iframe src='vir_terminal/iframe.html' class='vir_terminal' id=Vir_Terminal_"+c+"></iframe><br />");
                var obj=document.getElementById("Vir_Terminal_"+c).contentWindow;
                obj.document.write("f");
            }
        }
    }

    return{
        Process: function (cmdstr, mode, inputstr) {
            EvalProcess(cmdstr, mode, inputstr);
        }
    }
};