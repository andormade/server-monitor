import os from 'os';
import http from 'http';

const bufferSize = 60 * 60;
const buffer: [usedMemory: number, averageLoad: number][] = new Array(bufferSize).fill([0, 0]);
let pointer = 0;

setInterval(() => {
	buffer[pointer % bufferSize] = [1 - os.freemem() / os.totalmem(), os.loadavg()[0]];
	pointer++;
}, 1000);

const server = http.createServer(async (req, res) => {
	console.log('Request: ', req.url);

	switch (true) {
		case req.url && req.url.endsWith('log.json'):
			const data = JSON.stringify(buffer);

			res.writeHead(200, {
				'Cache-Control': 'no-cache',
				'Content-Length': data.length,
				'Content-Type': `application/json; charset=UTF-8`,
			});

			res.end(data);
			break;
	}
});

server.listen({ host: 'localhost', port: 42069 });
