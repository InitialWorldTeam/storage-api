let axios = require('axios');
let FormData = require('form-data');
let fs = require('fs');
let path = require('path');
let querystring= require('querystring');
const string2fileStream = require('string-to-file-stream');

exports.login = async function(host, password) {
	let data = JSON.stringify({
		"password": password
	});

	let config = {
		method: 'post',
		url: `${host}/api/v1/login`,
		headers: {
			'Content-Type': 'application/json'
		},
		data : data
	};

	return axios(config);
};

exports.upfile = async function(host, fname, jwt) {
	let data = new FormData();
	data.append('', fs.createReadStream(fname));


	let config = {
		method: 'post',
		url: `${host}/api/v1/files`,
		headers: {
			Authorization: `Bearer ${jwt}`,
			...data.getHeaders()
		},
		data : data,
		maxContentLength: Infinity,
		maxBodyLength: Infinity
	};

	return axios(config);
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

exports.upfolder = async function(host, fpath, jwt) {

	originalPath = path.resolve(fpath, "..")
	ofolder = path.relative(originalPath, path.join(fpath, "/"))

	let files = getAllFiles(fpath)
	let data = new FormData();
	for (file of files) {
		data.append(file.folder2, fs.createReadStream(file.path));
	}

	let config = {
		method: 'post',
		url: `${host}/api/v1/folder`,
		maxBodyLength: Infinity,
		headers: {
			folder: ofolder,
			Authorization: `Bearer ${jwt}`,
			...data.getHeaders()
		},
		data : data,
		maxContentLength: Infinity,
		maxBodyLength: Infinity
	};

	return axios(config);
}

exports.upDataAsFile = async function(host, fname, jsdata, jwt) {
	let result = JSON.stringify(jsdata);
	let s = string2fileStream(result, {path:fname});
	let data = new FormData();
	data.append('', s);

	let config = {
		method: 'post',
		url: `${host}/api/v1/files`,
		headers: {
			Authorization: `Bearer ${jwt}`,
			...data.getHeaders()
		},
		data : data,
		maxContentLength: Infinity,
		maxBodyLength: Infinity
	};

	return axios(config);
}

