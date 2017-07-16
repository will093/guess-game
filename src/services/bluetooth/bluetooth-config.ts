import { Injectable } from '@angular/core';

declare var networking: any;

@Injectable()
export class BluetoothConfig {
     
    public uuid: string = '94f39d29-7d6d-437d-973b-fba39e49d4ee';
    public confirmationMessageView: Uint8Array = new Uint8Array(new ArrayBuffer(8));

    // How long server should wait for devices to connect for before timing out.
    public connectionWaitTimeout: number = 50000;
    // How long client should attempt to discover devices for before timing out.
    public discoveryTimeout: number = 5000;
    // How long client should wait for server to send confirmation message before timing out.
    public confirmationTimeout: number = 1000;
    // How long server should wait after sending the confirmation message, before connection is complete. 
    // TODO: this is a hack to stop the confirmation message getting mangled with subsequent messages sent over bluetooth.
    public postConfirmationWaitTimeout: number = 500;
    // How many attempts client and server should make to connect to one another.
    public maxConnectionAttempts: number = 10;
}

