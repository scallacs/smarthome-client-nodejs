import { ActionInterface } from "./action-interface";
import { IotDirectiveInterface } from "../iot-directive-interface";
import { GPIOAction } from "./gpio-action";

export class ReadPinAction extends GPIOAction {
    protected action: string;
    protected channel: number;

    constructor(gpio: any, channel: number) {
        super(gpio, channel);
    }

    perform(message: IotDirectiveInterface<any>): Promise<any> {
        return this.gpio.setup(this.channel, this.gpio.DIR_OUT, 'none').then(() => {
            return this._readPin(this.channel);
        });
        
    }
}