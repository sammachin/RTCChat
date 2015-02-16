var PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
var IceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.RTCIceCandidate;
var SessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.RTCSessionDescription;

var baseURL = window.location.protocol + "//" + window.location.hostname + ":" +  window.location.port + window.location.pathname;
var chatchan
var peercon
var sig
var sigdata = []
var caller

var config = {
    iceServers: [{url: "stun:stun.services.mozilla.com"}]
}

var constraints = {
    mandatory: {
        OfferToReceiveAudio: false,
        OfferToReceiveVideo: false
    }
};

function shorten(callback){
   var longurl = baseURL + "/store.html?s=" + JSON.stringify(sigdata);
   var url = 'https://api-ssl.bitly.com/v3/shorten?access_token=b66658188589e02f6346e229a50c21d055e01b98&longUrl=' + encodeURIComponent(longurl);
    $.getJSON(
        url,
        {},
        function(response)
        {
            if(callback)
                callback(response.data.url);
        }
    );
}

function showlink(shorturl){
	var br = document.createElement('br');
	document.getElementById('signalling').appendChild(br);
	if (caller == null){
		var dest = document.getElementById('dest').value;
		var a = document.createElement('a');
		var linkText = document.createTextNode('Send SMS to ' + dest);
		a.appendChild(linkText);
		a.target = "new";
		a.href = 'sms:'+ dest +'?body='+shorturl
		a.id = "smslink"
		document.getElementById('signalling').appendChild(a);
	}
	else{
		var dest = caller
		var a = document.createElement('a');
		var linkText = document.createTextNode('Send SMS to ' + dest);
		a.appendChild(linkText);
		a.target = "new";
		a.href = 'sms://'+ dest +'?body='+shorturl
		a.id = "smslink"
		document.getElementById('signalling').appendChild(a);
	}
	
	var newDiv = document.createElement("div"); 
	var newContent = document.createTextNode(shorturl); 
	newDiv.appendChild(newContent)
	document.getElementById('signalling').appendChild(newDiv);
	
}

function send(method, data){
	if (data === "null"){
		return 
	}
	else {
		string = {}
		string[method] = data
	}
	if (sigdata.length == 0){
		if (document.getElementById('orig').value == ""){
			var address = {ORIG : "dummy" }
		}
		else{
			var address = {ORIG : document.getElementById('orig').value};
		}
		sigdata.push(address);
		sigdata.push(string);
		setTimeout(function(){ shorten(showlink); }, 3000);	
	}
	else{
		sigdata.push(string);
	}

	

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
	console.log('message recieved');
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
	peercon = new PeerConnection(config, {optional:[{RtpDataChannels: true}]});
	peercon.onicecandidate = function (ice) {
	    send("ICE", JSON.stringify(ice.candidate));
	};
	chatchan = peercon.createDataChannel("chat", {});
	chatchan.onmessage = function (e) {
		console.log(e);
	    rxMsg(e.data);
	};
	chatchan.onopen = function (){
		console.log('connected')
		document.getElementById('signalling').style.display = 'none';	
		document.getElementById('messaging').style.display = 'block';
	};
	addEvent(window, 'storage', function (event) {
	  if (event.key == 'test') {
		var signal = JSON.parse(event.newValue);
		console.log(signal);
	  	for (s in signal){
	  		method = Object.keys(signal[s])
	  		data = signal[s][method]
			if (method == "ORIG"){
				if (data == null){
					caller = "dummy";
				}
				else{
					caller = data;
				}
			}
	  		else if (method == "ICE") {
	  			addIce(JSON.parse(data));
	  		}
	  		else if (method == "OFFER"){
	  			pickup(JSON.parse(data));
	  		}
	  		else if (method == "ANSWER"){
	  			connect(JSON.parse(data));
	  		}		 
	  	}
	  }
	});
}


function addIce(ice){
	console.log('ADDICE');
	var i = new IceCandidate(ice);
	peercon.addIceCandidate(i);
}

function call(){
	peercon.createOffer(function (offer) {
	    	peercon.setLocalDescription(offer);
	    	send("OFFER", JSON.stringify(offer));
			}, 
		errorHandler, constraints);
}

function pickup(sig){
	console.log('PICKUP');
    offer = new SessionDescription(sig)
    peercon.setRemoteDescription(offer);
    peercon.createAnswer(function (answer) {
        peercon.setLocalDescription(answer);   
        send("ANSWER", JSON.stringify(answer));
    }, errorHandler, constraints);
}
    
function connect(sig){
	console.log('CONNECT');
	s = new SessionDescription(sig);
	peercon.setRemoteDescription(s)
}





