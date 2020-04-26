const https = require('https');


https.get(url, (resp) => {
	let data = '';
	resp.on('data', (chunk)=>{
		data += chunk;
	});

	respo.on('end', () =>{
		conlole.log(dat);
	})


}).on('error', (err) => {
	console.log(err);
})