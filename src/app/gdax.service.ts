import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class GdaxService {
    public priceChange$: Observable<Tick>;
    private changes = new ReplaySubject<Tick>(1);
    private socket = new WebSocket('wss://ws-feed.pro.coinbase.com');

    constructor() {
        this.priceChange$ = this.changes.asObservable();
        this.socket = new WebSocket('wss://ws-feed.gdax.com');
        const msg: any = {
            type: 'subscribe',
            product_ids: [
              'LTC-USD',
              'ETH-USD'
          ],
            channels: [
              {
                name: 'ticker',
                product_ids: [
                    'LTC-USD',
                    'ETH-USD'
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
                data.low_24h = data.low_24h.replace(/0+$/, '');
                data.high_24h = data.high_24h.replace(/0+$/, '');
                data.open_24h = data.open_24h.replace(/0+$/, '');
                this.changes.next(data);
            }
        };
    }
}

export class Tick {
    public best_ask: string;
    public best_bid: string;
    public high_24h: string;
    public last_size: string;
    public low_24h: string;
    public open_24h: string;
    public price: number;
    public product_id: string;
    public sequence: number;
    public side: string;
    public time: string;
    public trade_id: number;
    public type: string;
    public volume_24h: string;
    public volume_30d: string;
}
