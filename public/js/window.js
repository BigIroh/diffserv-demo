(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var EventEmitter = function () {
	this.listeners = {};
};

/**
 * Add a handler for a message type 
 *
 * @param {string} type - message type
 * @param {function} fn - handler to add
 */
EventEmitter.prototype.on = function (type, fn, ctx) {
	var wrapped;

	ctx = ctx || this;	
	wrapped = function () {
		fn.apply(ctx, Array.prototype.slice.call(arguments, 0));
	};

	fn.wrapped = wrapped;

	if(!this.listeners[type]) {
		this.listeners[type] = [wrapped];
	}
	else {
		this.listeners[type].push(wrapped);
	}
};

/**
 * Add a handler for a message type which removes itself
 * after a single execution
 *
 * @param {string} type - message type
 * @param {function} fn - handler to add
 */
EventEmitter.prototype.once = function (type, fn, ctx) {
	var wrapped;

	ctx = ctx || this;

	wrapped = function () {
		ctx.off(type, fn);
		fn.apply(ctx, Array.prototype.slice(arguments, 0));
	};

	fn.wrapped = wrapped;

	if(!this.listeners[type]) {
		this.listeners[type] = [wrapped];
	}
	else {
		this.listeners[type].push(wrapped);
	}	
};

/**
 * Remove a handler for a message type 
 *
 * @param {string} type - message type
 * @param {function} fn - handler to remove
 */
EventEmitter.prototype.off = function (type, fn) {
	var index;

	if(this.listeners[type]) {
		index = this.listeners[type].indexOf(fn);
		index2 = this.listeners[type].indexOf(fn.wrapped);
		if(index > -1) {
			this.listeners[type].splice(index, 1);
			return true;
		}
		else if(index2 > -1) {
			this.listeners[type].splice(index2, 1);
			return true;
		}
		else {
			return false;
		}
	}
	else {
		return false;
	}
};

EventEmitter.prototype.emit = function (type) {
	var payload = Array.prototype.slice.call(arguments, 1),
		fns = this.listeners[type] || [],
		i;

	for(i=0; i<fns.length; i++) {
		fns[i](payload);
	}
};

module.exports = EventEmitter;
},{}],2:[function(require,module,exports){
var EventEmitter = require('./EventEmitter'),
	Messenger;

/**
 * target {window} - window to communicate with
 * domain {string}
 */
Messenger = function (target, domain) {
	var ctx = this;

	this.target = target;
	this.domain = domain;
	this.listeners = {};

	//set up recieve message
	if(this.target.postMessage) {
		window.addEventListener('message', function (event) {
			var i;
			//coming from the right window, and we have listeners for it
			if(event.source === ctx.target && ctx.listeners[event.data.type]) {
				for(i=0; i<ctx.listeners[event.data.type].length; i++) {
					ctx.listeners[event.data.type][i](event.data.content);	
				}
			}
		});
	}
	else {
		throw new Error('Browser not yet supported.');
	}
};

Messenger.prototype = new EventEmitter();

Messenger.prototype.post = function(type, content) {
	var message = {
		type: type,
		content: content
	};

	/* @todo: set the domain here... security? */
	if(this.target.postMessage) {
		this.target.postMessage(message, '*');
	}
	else {
		throw new Error('Browser not yet supported.');
	}
};




module.exports = Messenger;
},{"./EventEmitter":1}],3:[function(require,module,exports){
var Messenger = require('../common/Messenger'),
	EventEmitter = require('../common/EventEmitter'),
	run = require('./run'),
	DiffServ;

DiffServ = function (options) {
	options = options || {};
	this.requestedFiles = [];
	this.responses = {};
	this.ready = false;
	this.iframe = document.createElement('iframe');
	this.iframe.src = options.iframeUrl || '../html/iframe.html';
	this.iframe.style.display = 'none';
	this.iframe.style.width = '1px';
	this.iframe.style.height = '1px';
	this.iframe.style.opacity = 0;
	this.iframe.style.visibility = 'hidden';

	document.documentElement.appendChild(this.iframe);
	this.messenger = new Messenger(this.iframe.contentWindow);

	this.messenger.once('ds-iframe-ready', function () {		
		
		this.ready = true;

		this.messenger.on('ds-response', function (data) {
			var nextFile;

			if(this.responses[data.name]) {
				throw new Error('Already seen ' + data.name);
			}
			else {
				this.responses[data.name] = data;
				nextFile = this.responses[this.requestedFiles[0]];
				while(this.requestedFiles.length && nextFile) {
					run(nextFile);
					this.requestedFiles.splice(0,1);
				}
			}
		}, this);
		
		this.emit('ready');

	}, this);

};

DiffServ.prototype = new EventEmitter();

DiffServ.prototype.get = function (filename) {
	this.requestedFiles.push(filename);

	if(!this.ready) {
		this.messenger.once('ds-iframe-ready', function () {
			this.messenger.post('ds-request', filename);
		}, this);
	}
	else {		
		this.messenger.post('ds-request', filename);
	}
	
};

module.exports = DiffServ;

},{"../common/EventEmitter":1,"../common/Messenger":2,"./run":5}],4:[function(require,module,exports){
window.DiffServ = require('./diffserv');
},{"./diffserv":3}],5:[function(require,module,exports){
/**
 * @param {object} file
 * @param {string} file.name
 * @param {string} file.version
 * @param {string} [file.content]
 * @param {string} [file.delta]
 */
var run = function (file) {
	var filenameParts = file.name.split('.'),
		extension = filenameParts[filenameParts.length - 1],
		body = document.documentElement,
		element,
		textNode;

	if(file.content) {
		if(extension === 'js') {
			textNode = document.createTextNode(file.content + '\n//# sourceURL=' + this.root + file.name);
		}
		else {
			textNode = document.createTextNode(file.content);
		}
	}
	
	if(extension === 'js') {
		element = document.createElement('script');
	}
	else if(extension === 'css') {
		element = document.createElement('style');
	}

	element.appendChild(textNode);
	body.appendChild(element);
};

module.exports = run;
},{}]},{},[4])