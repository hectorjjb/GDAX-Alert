import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'app';

    ngOnInit(): void {
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
        let count = 0;
        exampleSocket.onmessage = function (event) {
            const data = JSON.parse(event.data);
            if (data && data.changes && data.changes[0][2] !== '0') {
                if (data.changes[0][0] === 'buy') {
                    console.log(parseFloat(data.changes[0][1]).toFixed(2));
                } else {
                    console.log('                                                    ', parseFloat(data.changes[0][1]).toFixed(2));
                }
                count++;
                if (count > 30) {
                    console.clear();
                    count = 0;
                }
            }
        };
    }

}
