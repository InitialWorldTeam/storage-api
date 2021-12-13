var axios = require('axios');
var FormData = require('form-data');
var fs = require('fs');

exports.upfile = function(host, fname, res) {
	var data = new FormData();
	data.append('filese', fs.createReadStream(fname));

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

