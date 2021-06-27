/**
 * @author Christian Gomes & Johann Werkle
 * @file   Auditor Application
 * @date   27.06.2021
 */

 //Imports modules
 const net = require('net'); 
 const dgram = require('dgram'); 
 const moment = require('moment');
 const protocol = require('./auditor-protocol');
 
 //Instruments Map
 const instruments = new Map();
 instruments.set('ti-ta-ti', 'piano');
 instruments.set('pouet', 'trumpet');
 instruments.set('trulu', 'flute');
 instruments.set('gzi-gzi', 'violin');
 instruments.set('boum-boum', 'drum');
 
 //Musicians lists
 const musicians = new Map();
  
 //Creating a datagram socket
 const socket = dgram.createSocket('udp4');
 socket.bind(protocol.PROTOCOL_PORT, function() {
     console.log("Joining multicast group");
     socket.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
 });
 
 //New datagram has arrived
 socket.on('message', function(msg, source) {

    console.log("Data has arrived: " + msg + ". Source port: " + source.port);
 
     const res = JSON.parse(msg);

     //Testing musician with data received
     var musician = {
         instrument : instruments.get(res.instrument),
         activeSince : new moment().format()
     }
 
     musicians.set(res.uuid,musician);
 
     console.log(musicians);
 
 });


 //TCP PART
 const tcp_s = net.createServer();

 //Server TCP on Listening
 tcp_s.listen(protocol.PROTOCOL_PORT, function() {
     console.log("Now listening with TCP socket on port " + protocol.PROTOCOL_PORT);    
 });

 //Server TCP on connection
 tcp_s.on('connection', function(socket) {
 
    var currentMusician = [];

    //Checks the musicians lists
    musicians.forEach((musician) => {

        //Check the activeSince vs protocol timing
        if(moment(Date.now()).diff(musician.activeSince, 'seconds') > protocol.TIMEOUT)
        {
            musicians.delete(musician);
        }else{
            currentMusician.push(musician);
        }

    });
 
     //Prepare the payload
     payload = Buffer.from(JSON.stringify(currentMusician));
     socket.write(payload);
     socket.end();
 }) 
 