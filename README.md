## chat-stub

This is just a quick and dirty sandbox for a chat app using websockets.

### Software dependencies

* Node.js
* MongoDB
* Grunt (only if you want to perform dev)

### Service dependencies

MongoDB `mongod` service running locally on default port

### Setup

1. Make sure MongoDB `mongod` service is running on default port
2. Clone repo (https://github.com/jsandoval81/chat-stub.git)
3. From local prompt, navigate to repo root and run `npm cache clean && npm install`
4. After successful NPM install run `npm start`
6. Open a web browser to http://localhost:3200

### Notes

To perform any dev, simply run the `grunt dev` task. This will automate some of the dev tasks, such as asset bundle and minification and service restarts. Note: Currently the service restart doesn't handle state monitoring/reset on the DB.

Currently, both the minified and un-minified versions of the application.css and application.js files are being placed in the build directories. This is to allow an easy switch to the un-minified versions for development debugging from the browser.