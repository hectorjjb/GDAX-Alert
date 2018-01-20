import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/replaysubject';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class GdaxService {
    public priceChange$: Observable<number[][]>;
    private changes = new ReplaySubject<number[][]>(1);
    private reset = false;
    private socket = new WebSocket('wss://ws-feed.gdax.com');
    private buys: number[] = [];
    private sells: number[] = [];
    private b: number[] = [];
    private s: number[] = [];
    private SUM = (a, b) => a + b;

    constructor() {
        this.priceChange$ = this.changes.asObservable();
        this.socket = new WebSocket('wss://ws-feed.gdax.com');
        const msg: any = {
            'type': 'subscribe',
            'product_ids': [
                'LTC-USD',
            ],
            'channels': [
                'level2'
            ]
        };
        this.socket.onopen = (event) => {
            this.socket.send(JSON.stringify(msg));
        };
        setInterval(() => this.reset = true, 5000);
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data && data.changes && data.changes[0][2] !== '0') {
                const change = parseFloat(parseFloat(data.changes[0][1]).toFixed(2));
                if (data.changes[0][0] === 'buy') {
                    this.buys.push(change);
                } else {
                    this.sells.push(change);
                }
                if (this.reset) {
                    console.clear();
                    this.b = this.GetStats(this.buys);
                    this.s = this.GetStats(this.sells);
                    const p = parseFloat((((this.b[0] * this.b[1]) + (this.s[0] * this.s[1])) / (this.b[0] + this.s[0])).toFixed(2));
                    // console.log(`Vol : ${this.b[0] + this.s[0]}  avg: ${p}`);
                    this.buys = [];
                    this.sells = [];
                    this.reset = false;
                    this.changes.next([this.b, this.s, [this.b[0] + this.s[0], p]]);
                }
            }
        };
    }

    private GetStats(transactions: number[]): number[] {
        const sum = transactions.reduce(this.SUM);
        const total = transactions.length;
        const avg = parseFloat((sum / total).toFixed(2));
        // console.log(`Total: ${total}  avg: ${avg}`);
        return [total, avg];
    }

}
