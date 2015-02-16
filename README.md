# RTCChat
Experiments in Creating RTC Data Channel withuot a framework.

This repo contains 2 example projects, the first is a 'Bring your Own Signalling WebRTC chat application, it serves to show what WebRTC can do on it own and what you need to use some sort of signalling server for.

To get started download or clone the repo then place either of the folders onto a webserver, the simplest way to get started on a mac is to open terminal and cd into the folder then run python -m SimpleHTTPServer, you will then have the webserver running at http://127.0.0.1:8000

For the BYOSig application you can open 2 windows with the same index.html page, on the 1st window click Start Call then copy the text that is generated to the clipboard and in the 2nd window click recieve call then paste the text into the input and click process. This will then generate some more signalling text which you should copy and paste from window 2 back to the input of window 1. If all works then you will have a basic chat application up and running using the RTCData Channel.

There are a couple of bugs/limitations with this;
If using FireFox although the Data Channel connects the onmessage event doesn't seem to fire so the chat is not functional.
If using Chrome there seems to be some sort of timeout if you are too slow in transferring the response signallin
