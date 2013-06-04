/**
 * Created with JetBrains WebStorm.
 * User: Hn
 * Date: 13-3-23
 * Time: 下午12:09
 * To change this template use File | Settings | File Templates.
 * @return {string}
 */
function ShowCurrentNavigator() {
    var appData;
    var result="";
    var navag = navigator.userAgent;
    appData = AnalyseUserAgent(navag);
    result=result+"浏览器名称：" + appData.Name + "<br />";
    result=result+"用户代理：" + navag + "<br />";
    result=result+"浏览器版本号：" + appData.Version + "<br />";
    result=result+"操作系统：" + appData.OSVersion + "<br />";
    result=result+"<br />";
    return result;
}

