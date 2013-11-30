/**
 * Created with JetBrains WebStorm.
 * User: demohn
 * Date: 13-7-6
 * Time: 下午10:58
 * To change this template use File | Settings | File Templates.
 */
/**
 * WARNING
 * Here is a Node.js File.
 * To Run it ,You should first install Node.js,then use the command:
 * node server.js
 * to start the server.
 **/
var net = require("net");

var chatServer=net.createServer();
var clientList=[];
chatServer.on('connection',function(client){
    client.name =  client.remoteAddress + ":" + client.remotePort;
    client.write('Hi'+client.name + '!\n');

    clientList.push(client);

    client.on('data',function(data){
        broadcast(data,client);
    });

    client.on('end',function(){
         clientList.splice(clientList.indexOf(client),1);
    });
    function broadcast(message,client){
        for(var i=0;i<clientList.length;i++){
            if(client != clientList[i]){
                clientList[i].write(client.name+" says "+message);
            }
        }
    }
});


chatServer.listen(9000);