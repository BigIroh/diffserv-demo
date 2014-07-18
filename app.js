var express = require('express'),
	diffserv = require('diffserv-node-express');

var app = express();

app.use(diffserv({
	basePath: 'public',
	baseRoute: '',
	gitRoot: '.'
}));

app.use(express.static(__dirname + '/public'));

app.listen(8080);