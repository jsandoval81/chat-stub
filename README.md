chat-stub
=================
This is just a quick and dirty sandbox for a chat app using websockets.

Software Dependencies
=================
Node.js
MongoDB
Grunt (only if you want to perform dev)

Service Dependencies
=================
MongoDB mongod service running locally on default port

Setup
=================
1. Clone repo
2. In prompt, navigate to repo root and run npm cache clean && npm install
3. Make sure MongoDB is running
4. In prompt, navigate to /server directory
5. Run npm start
6. Note the port of the Express app in the console and open a web browser to http://localhost:port

Notes
=================
No tests (yet). 

This app was developed on a Windows box. This SHOULDN'T have an impact, but as stated above, this app hasn't yet had rigorous testing.