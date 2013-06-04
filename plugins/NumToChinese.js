function ntc(num){
    var Ccr;
    Ccr=NumToChinese(num);
    return Ccr;
}
/**
 * @return {string}
 */
function NumToChinese(num){
    var res="";
    var i,j;
    var charsetU=["零","一","二","三","四","五","六","七","八","九"];
    var charsetC=["零","壹","贰","叁","肆","伍","陆","柒","捌","玖"];
    var wordU=["点","十","百","千","万","亿"];
    var wordC=["点","拾","佰","仟","万","亿"];
    var regNum=/([0-9]+)\.{0,1}([0-9]*)/;
    if(regNum.test(num)==true){
        if(RegExp.$2!=null){

        }else{
            res+=charsetC[0];
            for(i=0;i<RegExp.$2.length;i++){
                res+=charsetU[RegExp.$2[i]];
            }
        }
    }else{
        return "ERROR!";

    }
}
