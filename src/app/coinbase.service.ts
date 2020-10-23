import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class CoinbaseService {
    public priceChange$: Observable<Tick>;
    private changes = new ReplaySubject<Tick>(1);
    private socket = new WebSocket('wss://ws-feed.pro.coinbase.com');

    constructor( private http: HttpClient) {
        this.priceChange$ = this.changes.asObservable();
        // this.socket = new WebSocket('wss://ws-feed.pro.coinbase.com');
        const msg: any = {
            type: 'subscribe',
            product_ids: [
                'LTC-USD'
                // 'ETH-USD'
            ],
            channels: [
                {
                    name: 'ticker',
                    product_ids: [
                        'LTC-USD'
                        // 'ETH-USD'
                    ]
                }
            ]
        };
        this.socket.onopen = (event) => {
            this.socket.send(JSON.stringify(msg));
        };
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'ticker') {
                data.price = parseFloat(data.price);
                data.low_24h = +data.low_24h.replace(/0+$/, '');
                data.high_24h = +data.high_24h.replace(/0+$/, '');
                data.open_24h = +data.open_24h.replace(/0+$/, '');
                data.volume_24h = +data.volume_24h;
                data.volume_30d = +data.volume_30d;
                data.low_24h_delta = +((data.price - data.low_24h) * 100 / data.price).toFixed(2);
                data.high_24h_delta = +((data.price - data.high_24h) * 100 / data.price).toFixed(2);
                this.changes.next(data);
            }
        };
        this.http.get('https://api.pro.coinbase.com/products/LTC-USD/candles?granularity=86400').subscribe(r => {
            console.log(r);
        });
    }
}

export class Tick {
    // tslint:disable-next-line: variable-name
    public best_ask: string;
    // tslint:disable-next-line: variable-name
    public best_bid: string;
    // tslint:disable-next-line: variable-name
    public high_24h: string;
    // tslint:disable-next-line: variable-name
    public high_24h_delta: number;
    // tslint:disable-next-line: variable-name
    public last_size: string;
    // tslint:disable-next-line: variable-name
    public low_24h: string;
    // tslint:disable-next-line: variable-name
    public low_24h_delta: number;
    // tslint:disable-next-line: variable-name
    public open_24h: string;
    public price: number;
    // tslint:disable-next-line: variable-name
    public product_id: string;
    public sequence: number;
    public side: string;
    public time: string;
    // tslint:disable-next-line: variable-name
    public trade_id: number;
    public type: string;
    // tslint:disable-next-line: variable-name
    public volume_24h: string;
    // tslint:disable-next-line: variable-name
    public volume_30d: string;
}
