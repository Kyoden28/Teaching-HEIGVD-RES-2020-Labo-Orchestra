/**
 * @author Christian Gomes & Johann Werkle
 * @file   Musician Application
 * @date   27.06.2021
 */

 //Imports modules
const protocol = require('./orchestra-protocol');
const dgram = require('dgram');
const { v4: uuidv4 } = require('uuid');

var socket = dgram.createSocket('udp4');

//Instruments map
const instruments = new Map();
instruments.set("piano", "ti-ta-ti");
instruments.set("trumpet", "pouet");
instruments.set("flute", "trulu");
instruments.set("violin", "gzi-gzi");
instruments.set("drum", "boum-boum");


//Function musician with a generated uuid and instrument given by line command
function Musician() {

    this.uuid =  uuidv4();
    this.instrument = instrument;

    Musician.prototype.play = function() {

        var musician = {
            uuid : this.uuid,
            instrument : instruments.get(instrument),
            timestamp : Date.now()
        };
        
        var payload = JSON.stringify(musician)
    
        message = new Buffer(payload);

         // Sending on socket (encapsulate the payload in a UDP datagram)
        socket.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS, function(err, bytes) {
            console.log("Sending payload :" + payload + " via port " + socket.address().port + " and he's doing " + musician.instrument);
		});

    }

    //Send all seconds
    setInterval(this.play.bind(this),1000);

}

//Get properties about line commande
var instrument = process.argv[2];

//Detect no argument, and define the first instrument
if(instrument == null)
    instrument = 'piano';

//Let's create a new Musician
var m1 = new Musician(instrument);