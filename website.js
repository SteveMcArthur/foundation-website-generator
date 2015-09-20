/*global require, __dirname, process, exports*/
var fs = require('fs-extra');
var path = require('path');
var eco = require('eco');

var layoutDir = path.join(__dirname, 'layouts');
var documentDir = path.join(__dirname, 'vendors', 'html');
var assetsDir = path.join(__dirname, 'vendors', 'assets');
//var outputDir = path.join(__dirname, 'output');
var outputDir = process.cwd();
var metaRegex = new RegExp(/^---\s*\n\r*[\s*\w+\s*:\s*.+\n\r*]+---/);
var defaultLayout = 'default.html.eco';

var site = {
	scripts: [],
	styles: []
};

var document = {
	scripts: [],
	styles: []
};


function extractMeta(tmpl) {
	var idx = tmpl.indexOf('---', 3);
	var meta = {};
	if (idx > 0) {
		var metaStr = tmpl.slice(0, idx);
		tmpl = tmpl.slice(idx + 3);
		metaStr = metaStr.replace(/---/g, '').replace(/\r/g, '').trim();
		var items = metaStr.split('\n');
		for (var i = 0; i < items.length; i++) {
			if (items[i].indexOf(':') > -1) {
				var prop = items[i].split(':');
				var val = prop[1];
				val = val.replace(/^\'|\'$|^\"|\"$/g, '').trim();
				var p = prop[0].replace(/^\'|\'$|^\"|\"$/g, '').trim();
				meta[p] = val;
			}

		}
	}

	return {
		tmpl: tmpl,
		meta: meta
	};
}

function getTemplate(filePath) {
	var tmpl = fs.readFileSync(filePath, 'utf-8');
	var data = extractMeta(tmpl);
	return data;
}

var blockObj = function () {
	return {
		add: function () {
			return blockObj();
		},
		toHTML: function () {}
	}
};

function renderFile(documentFile) {

	var templateList = [];
	var documentPath = path.join(documentDir, documentFile);
	var data = getTemplate(documentPath);

	if (!data.meta.layout) {
		data.meta.layout = defaultLayout;
	}
	templateList.push(data);

	while (data.meta && data.meta.layout) {
		var layoutFile = path.join(layoutDir, data.meta.layout);
		data = getTemplate(layoutFile);
		templateList.push(data);
	}

	var content = "";

	for (var i = 0; i < templateList.length; i++) {
		content = eco.render(templateList[i].tmpl, {
			content: content,
			site: site,
			document: document,
			getBlock: function () {
				return blockObj()
			},
			getPreparedTitle: function () {
				return "My Website";
			},
			getPreparedDescription: function () {
				return "Description";
			},
			getPreparedKeywords: function () {
				return "keywords";
			}


		});
	}


	var file = path.join(outputDir, documentFile);
	fs.writeFileSync(file, content, 'utf-8');
}

function getDirectories(srcpath) {
	return fs.readdirSync(srcpath).filter(function (file) {
		return fs.statSync(path.join(srcpath, file)).isDirectory();
	});
}

var params;

function renderSome(file) {
	var f = file.split('.')[0];
	if (params.pagetypes.indexOf(f) > -1) {
		renderFile(file);
		console.log(file + " rendered");
	}
}

function generate(answers) {

	var start = new Date();
	params = answers;


	fs.readdir(documentDir, function (err, files) {
		if (err) {
			console.log(err);
			return;
		}

		var renderFn = (params.pagetypes.indexOf('all') > -1) ? renderFile : renderSome;

		for (var i = 0; i < files.length; i++) {
			renderFn(files[i]);
		}

		fs.copySync(assetsDir, outputDir);

		var end = new Date();
		var diff = (end.getTime() - start.getTime()) / 1000;
		console.log("Total time: " + diff + " seconds");

	});
}

exports.generate = generate;