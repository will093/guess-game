import { Injectable } from 'angular2/core';

declare var networking: any;

@Injectable()
export class BluetoothConfig {
     
    public uuid: string = '94f39d29-7d6d-437d-973b-fba39e49d4ee';
    public confirmationMessageView: Uint8Array = new Uint8Array(new ArrayBuffer(8));

    public connectionWaitTimeout: number = 60000;
    public discoveryTimeout: number = 30000;
    public confirmationTimeout: number = 5000;
}

