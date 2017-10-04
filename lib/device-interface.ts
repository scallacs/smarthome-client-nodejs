import { IotDirectiveInterface } from "./iot-directive-interface";

export interface DeviceInterface {

    connect(): Promise<any>;

    disconnect(): Promise<any>;

    start(): Promise<any>;

    /**
     * Acknowledge reception of message
     */
    ack(directive: IotDirectiveInterface<any>): Promise<any>;

    /**
     * Failure
     */
    failure(directive: IotDirectiveInterface<any>, error: any): Promise<any>;

    /**
     * Success
     */
    success(directive: IotDirectiveInterface<any>): Promise<any>;
    
}