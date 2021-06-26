import os from 'os';
import http from 'http';
import ssr from './ssr';
import { LogItem } from './types';

const bufferSize = 60 * 60;
const buffer: LogItem[] = new Array(bufferSize).fill([0, 0]);
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
		default:
			const website = ssr(buffer);

			res.writeHead(200, {
				'Cache-Control': 'no-cache',
				'Content-Length': website.length,
				'Content-Type': `text/html; charset=UTF-8`,
			});

			res.end(website);
	}
});

server.listen({ host: 'localhost', port: 42069 });
