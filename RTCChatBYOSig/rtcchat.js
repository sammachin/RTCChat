

var PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
var IceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.RTCIceCandidate;
var SessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.RTCSessionDescription;

var chatchan = null;
var peercon = null;
var sig = null;
var sigdata = []

var config = {
    iceServers: [{url: "stun:stun.services.mozilla.com"}]
}

var constraints = {
    mandatory: {
        OfferToReceiveAudio: false,
        OfferToReceiveVideo: false
    }
};

function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}


function send(method, data){
	if (data === "null"){
		return 
	}
	else {
		string = {}
		string[method] = data
	}
	sigdata.push(string);
	document.getElementById('sigdata').innerHTML = JSON.stringify(sigdata)	
}

function exec(){
	var sigdata = JSON.parse(document.getElementById('siginput').value)
	for (s in sigdata){
		method = Object.keys(sigdata[s])
		data = JSON.parse(sigdata[s][method])
		if (method == "ICE") {
			addIce(data);
		}
		else if (method == "OFFER"){
			pickup(data);
		}
		else if (method == "ANSWER"){
			connect(data);
		}
	}
	document.getElementById('siginput').value = null
	document.getElementById('siginput').style.display = 'none';
	document.getElementById('exec').style.display = 'none';
}

var errorHandler = function (err) {
    console.error(err);
};

function sendMsg(){
	var msg = document.getElementById('msginput').value;
	chatchan.send(msg);
	var newDiv = document.createElement("div"); 
	var newContent = document.createTextNode(msg); 
	newDiv.appendChild(newContent)
	newDiv.className = 'to'
	document.getElementById('message').appendChild(newDiv);
	document.getElementById('msginput').value = null
	var newDiv = document.createElement("div"); 
	newDiv.className = 'clear'
	document.getElementById('message').appendChild(newDiv);
}

function rxMsg(msg){
	var newDiv = document.createElement("div"); 
	var newContent = document.createTextNode(msg); 
	newDiv.appendChild(newContent)
	newDiv.className = 'from'
	document.getElementById('message').appendChild(newDiv);
	document.getElementById('msginput').value = null
	var newDiv = document.createElement("div"); 
	newDiv.className = 'clear'
	document.getElementById('message').appendChild(newDiv);
}

function setup() {
	document.getElementById('messaging').style.display = 'none';
	document.getElementById('siginput').style.display = 'none';
	document.getElementById('exec').style.display = 'none';
	peercon = new PeerConnection(config, {optional:[{RtpDataChannels: true}]});
	peercon.onicecandidate = function (ice) {
	    send("ICE", JSON.stringify(ice.candidate));
	};
	chatchan = peercon.createDataChannel("chat", {reliable: false});
	chatchan.onmessage = function (e) {
		console.log(e);
	    rxMsg(e.data);
	}
	chatchan.onopen = function (){
		document.getElementById('sigdata').innerHTML = ''
		document.getElementById('signalling').style.display = 'none';	
		document.getElementById('messaging').style.display = 'block';
		
	};
}

function addIce(ice){
	var i = new IceCandidate(ice);
	peercon.addIceCandidate(i);
}

function call(){
	peercon.createOffer(function (offer) {
	    	peercon.setLocalDescription(offer);
	    	send("OFFER", JSON.stringify(offer));
			}, 
		errorHandler, constraints);
	document.getElementById('call').style.display = 'none';
	document.getElementById('receive').style.display = 'none';
	document.getElementById('siginput').style.display = 'block';
	document.getElementById('exec').style.display = 'block';
}

function recieve(){
	document.getElementById('call').style.display = 'none';
	document.getElementById('receive').style.display = 'none';
	document.getElementById('siginput').style.display = 'block';
	document.getElementById('exec').style.display = 'block';
}

function pickup(sig){
    offer = new SessionDescription(sig)
    peercon.setRemoteDescription(offer);
    peercon.createAnswer(function (answer) {
        peercon.setLocalDescription(answer);   
        send("ANSWER", JSON.stringify(answer));
    }, errorHandler, constraints);
}
    

function connect(sig){
	s = new SessionDescription(sig);
	peercon.setRemoteDescription(s)
}



