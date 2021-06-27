/**
 * @author Christian Gomes & Johann Werkle
 * @file   Auditor Application
 */

 const net = require('net'); 
 const dgram = require('dgram'); 

 const tcp_s = net.createServer();
 const moment = require('moment');
 const protocol = require('./auditor-protocol');
 
 //Instruments 
 const instruments = new Map();
 instruments.set('ti-ta-ti', 'piano');
 instruments.set('pouet', 'trumpet');
 instruments.set('trulu', 'flute');
 instruments.set('gzi-gzi', 'violin');
 instruments.set('boum-boum', 'drum');
 
 //Storing musicians
 const musicians = new Map();

 const socket = dgram.createSocket('udp4');
 //Creating a datagram socket
 socket.bind(protocol.PROTOCOL_PORT, function() {
     console.log("Joining multicast group");
     socket.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
 });
 
 //New datagram has arrived
 socket.on('message', function(msg, source) {

    console.log("Data has arrived: " + msg + ". Source port: " + source.port);
 
     const res = JSON.parse(msg);

     //console.log(res);

     //Testing musician with data received
     var musician = {
         instrument : instruments.get(res.instrument),
         activeSince : new moment().format()
     }
 
     musicians.set(res.uuid,musician);
 
     console.log(musicians);
 
 });
 
 tcp_s.listen(protocol.PROTOCOL_PORT, function() {
     console.log("Now listening with TCP socket on port " + protocol.PROTOCOL_PORT);    
 });
 
 tcp_s.on('connection', function(socket) {
 
    console.log("A connection TCP ON");

    var currentMusician = [];

    musicians.forEach((musician) => {

        if(moment(Date.now()).diff(musician.activeSince, 'seconds') > protocol.TIMEOUT)
        {
            musicians.delete(musician);
        }else{
            currentMusician.push(musician);
        }

    });
 
     payload = Buffer.from(JSON.stringify(currentMusician));
     //console.log("Payload " + payload);
     socket.write(payload);
     socket.end();
 }) 
 