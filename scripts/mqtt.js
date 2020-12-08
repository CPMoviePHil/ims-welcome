let mqtt = require('mqtt');
let opt = {
    port: 18896,
    username: 'xpimqtpq',
    password: 'r512yUWDQJO9',
};
let humidity;
let temperature;
let pmAir;
let client = mqtt.connect('mqtt://mqtt.shoesconn.com', opt);

client.on('connect', function () {
    console.log('已連接至MQTT伺服器');
    client.subscribe("humidity");
    client.subscribe("temperature");
    client.subscribe("pm2_5");
});

const app = require('express')();
const server = require('http').createServer(app);
const options = { cors: {
        origin: '*',
    }};
const io = require('socket.io')(server, options);
const days = ['日','一','二','三','四','五','六'];
//var sio = io.listen(server);
io.on('connection', function(socket){
    client.on('message', function (topic, msg) {
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let getWeek = days[ date_ob.getDay() ];
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        console.log(msg);
        if(topic === "temperature"){
            temperature = msg.toString();
        }
        if(topic === "humidity"){
            humidity = msg.toString();
        }
        if(topic === "pm2_5"){
            pmAir = msg.toString();
        }
        socket.emit('mqtt', {
            'temperature': temperature,
            'humidity': humidity,
            'pmAir': pmAir,
            'date':  year + "/" + month + "/" + date + " (" + getWeek + ") " + hours + ":" + minutes,
        });
    });
});
server.listen(5000);
