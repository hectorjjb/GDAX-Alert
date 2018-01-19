import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'app';

    public ngOnInit(): void {
        const exampleSocket = new WebSocket('wss://ws-feed.gdax.com');
        const msg: any = {
            'type': 'subscribe',
            'product_ids': [
                'LTC-USD',
            ],
            'channels': [
                'level2'
            ]
        };
        exampleSocket.onopen = function (event) {
            exampleSocket.send(JSON.stringify(msg));

        };
        let reset = false;
        let buys: number[] = [];
        let sells: number[] = [];
        let b: number[] = [];
        let s: number[] = [];
        setInterval(() => reset = true, 5000);
        exampleSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data && data.changes && data.changes[0][2] !== '0') {
                const change = parseFloat(parseFloat(data.changes[0][1]).toFixed(2));
                if (data.changes[0][0] === 'buy') {
                    // console.log(change);
                    buys.push(change);
                } else {
                    // console.log('                                                    ', change);
                    sells.push(change);
                }
                if (reset) {
                    console.clear();
                    b = this.GetStats('Buy', buys);
                    s = this.GetStats('Sell', sells);
                    console.log(`Vol : ${b[0] + s[0]}  avg: ${(b[0] * b[1] + s[0] * s[1]) / (b[0] + s[0])} mean: ${(b[2] + s[2]) / 2}`);
                    buys = [];
                    sells = [];
                    reset = false;
                }
            }
        };
    }

    private GetStats(type: string, transactions: number[]): number[] {
        let sum = 0;
        transactions.sort();
        for (const t of transactions) {
            sum += t;
        }
        const total = transactions.length;
        const avg = parseFloat((sum / total).toFixed(2));
        const mean = parseFloat(transactions[Math.round(total / 2)].toFixed(2));
        console.log(`${type} : ${total}  avg: ${avg} mean: ${mean}`);
        return [total, avg, mean];
    }
}
