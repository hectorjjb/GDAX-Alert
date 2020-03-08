import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
    private audio = new Audio('/assets/audio/coins.mp3');
    private permission = false;

    constructor() {
        // Let's check if the browser supports notifications
        if (!('Notification' in window)) {
            console.error('This browser does not support desktop notification');
        } else if ((Notification as any).permission !== 'denied') {
            console.log('requestPermission');
            Notification.requestPermission((permission) => {
                // If the user accepts, let's create a notification
                if (permission === 'granted') {
                    this.permission = true;
                    console.log('requestPermission granted');

                }
            });
        }

    }

    public notify(msg: string): void {
        if (this.permission) {
            const options: NotificationOptions = {
                body: msg,
                icon: 'https://news.bitcoin.com/wp-content/uploads/2017/12/gdax-bitcoin-trading-exchange-746x420.png'
            };
            const notification = new Notification('LTC Alert', options);
            this.audio.play();
        }
    }

}
