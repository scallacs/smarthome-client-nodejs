import { IotDirectiveInterface } from "./iot-directive-interface";

export interface DeviceInterface {

    connect(): Promise<any>;

    disconnect(): Promise<any>;
    
    /**
     * Acknowledge reception of message
     */
    ack(directive: IotDirectiveInterface): Promise<any>;

    /**
     * Failure
     */
    failure(directive: IotDirectiveInterface, error: any): Promise<any>;

    /**
     * Success
     */
    success(directive: IotDirectiveInterface): Promise<any>;
    
}