import { LogItem } from './types';

function renderChart(points: number[]): string {
	return `
        <svg viewBox="0 0 ${points.length} 100">
            <polyline
                fill="none"
                stroke="#ff0000"
                stroke-width="1"
                points="${points.map((point, index) => `${index}, ${point}`).join('\n')}"
            />
        </svg>
    `;
}

export default function ssr(buffer: LogItem[]): string {
	return `
        <!DOCTYPE html>
        <html>
            <head>
                <meta http-equiv="refresh" content="10">
            </head>
            <body>
                ${renderChart(buffer.map(([usedMemory]) => 100 - usedMemory * 100))}
                ${renderChart(buffer.map(([, averageLoad]) => 100 - averageLoad * 100))}
            </body>
        </html>
    `;
}
