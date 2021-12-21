var axios = require('axios');
var FormData = require('form-data');
var fs = require('fs');
var path = require('path');
var querystring= require('querystring');
const string2fileStream = require('string-to-file-stream');

exports.upfile = function(host, fname, res) {
	var data = new FormData();
	data.append('', fs.createReadStream(fname));

	var config = {
		method: 'post',
		url: `${host}/api/v1/files`,
		headers: {
			...data.getHeaders()
		},
		data : data
	};

	axios(config)
		.then(res)
		.catch(function (error) {
			throw new Error(error)
		});
}


function getAllFiles(dirPath, originalPath, originalPath2, arrayOfFiles) {
	files = fs.readdirSync(dirPath)

	arrayOfFiles = arrayOfFiles || []
	originalPath = originalPath || path.resolve(dirPath, "..")
	originalPath2 = originalPath2 || path.resolve(dirPath, ".")

	folder = path.relative(originalPath, path.join(dirPath, "/"))

	files.forEach(function (file) {
		if (fs.statSync(dirPath + "/" + file).isDirectory()) {
			arrayOfFiles = getAllFiles(dirPath + "/" + file, originalPath, originalPath2, arrayOfFiles)
		} else {
			fpath = path.join(dirPath, "/", file)

			arrayOfFiles.push({
				folder: path.relative(originalPath, fpath).replace(/\\/g, "/"),
				folder2: folder,
				folder3: path.relative(originalPath2, fpath).replace(/\\/g, "/"),
				//content: fs.readFileSync(fpath),
				path: fpath,
				filename: file
			})
		}
	})

	return arrayOfFiles
}

exports.upfolder = function(host, fpath, res) {

	originalPath = path.resolve(fpath, "..")
	ofolder = path.relative(originalPath, path.join(fpath, "/"))

	let files = getAllFiles(fpath)
	var data = new FormData();
	for (file of files) {
		data.append(file.folder2, fs.createReadStream(file.path));
	}

	var config = {
		method: 'post',
		url: `${host}/api/v1/folder`,
		headers: { 
			folder: ofolder,
			...data.getHeaders()
		},
		data : data
	};

	axios(config)
		.then(res)
		.catch(function (error) {
			throw new Error(error)
		});
}

exports.upDataAsFile = function(host, fname, jsdata, res) {
	let result = querystring.stringify(jsdata);
	let s = string2fileStream(result, {path:fname});
	var data = new FormData();
	data.append('', s);

	var config = {
		method: 'post',
		url: `${host}/api/v1/files`,
		headers: {
			...data.getHeaders()
		},
		data : data
	};

	axios(config)
		.then(res)
		.catch(function (error) {
			throw new Error(error)
		});
}
