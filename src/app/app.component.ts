import { Component, OnInit } from '@angular/core';
import { NotificationService } from './notification.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public title = 'app';
    private wantedPrice = 210;
    private reset = false;

    constructor(private notificationSvc: NotificationService) { }

    public ngOnInit(): void {
        const socket = new WebSocket('wss://ws-feed.gdax.com');
        const msg: any = {
            'type': 'subscribe',
            'product_ids': [
                'LTC-USD',
            ],
            'channels': [
                'level2'
            ]
        };
        socket.onopen = function (event) {
            socket.send(JSON.stringify(msg));
        };
        let buys: number[] = [];
        let sells: number[] = [];
        let b: number[] = [];
        let s: number[] = [];
        setInterval(() => this.reset = true, 5000);
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data && data.changes && data.changes[0][2] !== '0') {
                const change = parseFloat(parseFloat(data.changes[0][1]).toFixed(2));
                if (data.changes[0][0] === 'buy') {
                    buys.push(change);
                } else {
                    sells.push(change);
                }
                if (this.reset) {
                    console.clear();
                    b = this.GetStats('Buy', buys);
                    s = this.GetStats('Sell', sells);
                    const p = (b[0] * b[1] + s[0] * s[1]) / (b[0] + s[0]);
                    console.log(`Vol : ${b[0] + s[0]}  avg: ${p} mean: ${(b[2] + s[2]) / 2}`);
                    if (p > this.wantedPrice) {
                        this.notificationSvc.notify('$ ' + p);
                    }
                    buys = [];
                    sells = [];
                    this.reset = false;
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

