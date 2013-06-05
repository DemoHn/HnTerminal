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
        AddTerminalEventListener();
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
    new TerminalCore("TerminalShell").Circulate();
    cid.css("width", chei);
}