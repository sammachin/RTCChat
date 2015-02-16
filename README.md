# RTCChat
Experiments in Creating RTC Data Channel withuot a framework.

This repo contains 2 example projects, the first is a 'Bring your Own Signalling WebRTC chat application, it serves to show what WebRTC can do on it own and what you need to use some sort of signalling server for.

To get started download or clone the repo then place either of the folders onto a webserver, the simplest way to get started on a mac is to open terminal and cd into the folder then run python -m SimpleHTTPServer, you will then have the webserver running at http://127.0.0.1:8000

## BYO Signalling Demo
You can open 2 windows with the same index.html page, on the 1st window click Start Call then copy the text that is generated to the clipboard and in the 2nd window click recieve call then paste the text into the input and click process. This will then generate some more signalling text which you should copy and paste from window 2 back to the input of window 1. If all works then you will have a basic chat application up and running using the RTCData Channel.

### Known Issues
There are a couple of bugs/limitations with this;
* If using FireFox although the Data Channel connects the onmessage event doesn't seem to fire so the chat is not functional.
* If using Chrome there seems to be some sort of timeout if you are too slow in transferring the response signalling from the recipient back to the originator, this seems to be more of an issue when using 2 machines rather than 2 windows on the same client so I suspect Chrome has a timeout on the STUN signalling somewhere, Firefox seems a lot happier with this.

### Video
<iframe width="640" height="480" src="https://www.youtube.com/embed/TWl08wI_eb8" frameborder="0" allowfullscreen></iframe>

## SMS Signalling
This demo was written to demonstrate using SMS as the signalling method to transport the conneciton data between 2 browsers, therefore it works best on android handsets, you can test it in a desktop browser by cut & pasting the biy.ly links from one browser to another, in whiche case using dummy values for the phone numbers eg 111 & 222.

It works in much the same way as the BYO Sig app however once an OFFER  has been created it waits 3 secs for ICE candidates to be created then takes the whole string and creates a URL to the store.html page where the signalling data is the query string, obviously this URL is then too long for most concatenated SMS apps (1000chars seems to be the max) so I shorten it using bit.ly and then take the resulting short URL and create an SMS URI to send that URL over SMS to the recipient handset.

The recipient handset will need to have the main index.html page open already in their browser, when they recieve the bit.ly link they tap that which will open in a new tab within the browser, that url resolves to a /store.html page in my application which will take the quety string S parameter and place that into the browsers local storage, the main index.html page that is running in another tab has some JS which is watching for a change in localstorage so when the store page inserts the data the index page picks it up and processes it as signalling, the index page then does the same dance for its response signalling (the originators mobile number is added to the signalling) and creates a new bit.ly link and SMS URI to send the response SMS. Once that has been sent back to the originator and processed (via localstorage) the Data Channell should be established between the browsers.

## Known Issues
* Again firefox has issues with the On Message so although the channel is open messages are not recieved at the far end.
* This demo is best tested in firefox however as due to the delay in sending and opening the SMS's the chrome bug causes the connection to timeout.
* Certain android handsets seem to prefer different flavours of the sms: URI the current version works on the Nexus5 and LG G3 both running lolipop with Firefox as the default browser and Messaging by 8bit SMS as the default SMS client.


## Video
<iframe width="853" height="480" src="https://www.youtube.com/embed/88MQfHZvQj8" frameborder="0" allowfullscreen></iframe>


