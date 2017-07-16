import { Injectable } from '@angular/core';

// Used to store data as it is received in chunks over bluetooth.
@Injectable()
export class MessageData {
    // The total length of the data in bytes.
    public totalLength: number;

    // Current length of the data in bytes.
    public currentLength: number;

    // The portion of the JSON string recevied so far.
    public currentData: string;
}

