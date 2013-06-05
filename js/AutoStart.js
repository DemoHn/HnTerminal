/**
 * Created with JetBrains WebStorm.
 * User: demohn
 * Date: 13-6-5
 * Time: 上午9:17
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(
    function(){
        SysInit("TerminalShell","TerminalFrame","iframe");
    }
);

function SysInit(parent_id, iframe_id, wrapi_id) {
    var regnum = /[0-9]+/;
    var cid = $("#" + parent_id);
    var cln = $("#LineNumber").css("width");
    var chei = regnum.exec(cid.css("width")) - regnum.exec(cln) + "px";
    IO_Config.parent_id = parent_id;
    IO_Config.iframe_id = iframe_id;
    IO_Config.wrapi_id = wrapi_id;
    $("#all").css("height", ($(document).height()));
    cid.css("width", chei);
    SysLog("初始化完毕！");
    SysLog("现在开始加载自动运行程序……");
    SysAutoStart();

    //加载命令提示符
    new TerminalCore("TerminalShell").Circulate();
    AddInputExpendListener();
}

function SysAutoStart(){
    var cmd=new Command(IO_Config.parent_id);
    var io=new TerminalIO(IO_Config.parent_id);
    cmd.ExecCMD("About()");
    io.Output("浏览器参数：<br />"+navigator.userAgent+"<br /><br />");
    io.Output("高考加油！<br /><br />");
    //cmd.ExecCMD("Cls()");
}

function SysLog(text){
    if(IO_Config.ShowSysLog=="yes"){
        new TerminalIO(IO_Config.parent_id).Output(text+"<br />");
        console.log(text);
    }else{
        console.log(text);
    }
}