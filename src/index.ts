import os from 'os';
import http from 'http';
import si from 'systeminformation';

import ssr from './ssr';
import { LogItem } from './types';
import { exec } from 'child_process';

const bufferSize = 10 * 60;
const buffer: LogItem[] = new Array(bufferSize).fill([0, 0]);
let pointer = 0;

exec('sensors -j', function (error, stdout) {
	console.log(stdout);
});

setInterval(async () => {
	const { main: cpuTemperature } = await si.cpuTemperature();
	buffer[pointer % bufferSize] = [1 - os.freemem() / os.totalmem(), os.loadavg()[0], cpuTemperature];
	pointer++;
}, 1000);

const server = http.createServer(async (req, res) => {
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
