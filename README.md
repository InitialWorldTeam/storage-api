# storage-api
storage-api

## install 

```
npm install InitialWorldTeam/storage-api
```

## usage

```
var api = require('storage-api')

api.login("http://localhost:3000", "password",(res) =>{
    console.log(res.data.data);
})


// upload file
api.upfile("http://localhost:3000", "./test/1.txt", (response) => {
	console.log(JSON.stringify(response.data));
})

// upload folder
api.upfolder("http://localhost:3000", "./test", (response) => {
	console.log(JSON.stringify(response.data));
})

//upload JSON data
api.upDataAsFile("http://localhost:3000", "newfile.txt", {foo:'bar',cool:['xux', 'yys']}, (response) => {
	console.log(JSON.stringify(response.data));
})
```
