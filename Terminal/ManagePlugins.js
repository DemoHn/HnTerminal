/**
 * @return {number}
 */
function ManagePlugins(orderset) {
    var AllPluginsID = new Array();
    AllPluginsID[0]="ShowCurrentNavigator";
    AllPluginsID[1]="NumToChinese";
    if (orderset[0] == "navigator") {
        var res="ERR";
        res=ShowCurrentNavigator();
        JSOutput(res, "");
        return 0;
    } else if (orderset[0] == "allplugins") {
        ShowAllPlugins(AllPluginsID);
        return 0;
    }else if(orderset[0]=="ntc"){
        NumToChinese(orderset[1]);
        return 0;
    } else {
        return 1;
    }
}


/*添加plugins的link到Terminal主目录下,其中plugin放在plugins/下*/

function AddPluginLinks(pluginname) {
    var scr;
    scr = document.createElement("script");
    scr.setAttribute("type", "text/javascript");
   // scr.setAttribute("id", pluginname + "PLUJS");
    scr.setAttribute("src", "plugins/" + pluginname + ".js");
    document.getElementsByTagName("head").item(0).appendChild(scr);
}

function RemovePluginLinks(pluginname) {
    var hea = document.getElementsByTagName("head").item(0);
    var src = document.getElementById(pluginname + "PLUJS");
    if (src == null || src == undefined) {
        JSOutput("找不到要删除的链接！", "");
    } else {
        hea.removeChild(src);
    }
}

function ShowAllPlugins(AllPluginsID) {
    var i;
    JSOutput("所有插件列表：<br />", "");
    for (i = 0; i < AllPluginsID.length; i++) {
        JSOutput(AllPluginsID[i] + "<br />", "");
    }
    JSOutput("<br />","");
}

