import { ActionInterface } from "./action-interface";
import { IotDirectiveInterface } from "../iot-directive-interface";

export abstract class GPIOAction implements ActionInterface {

    constructor(protected gpio: any, protected channel: number) {
    }
    
    abstract perform(message: IotDirectiveInterface<any>): Promise<any>;

    _writePin(channel: number, value: any) {
        return this.gpio.write(channel, value);
    }

    _readPin(channel: number) {
        return this.gpio.read(channel);
    }
}