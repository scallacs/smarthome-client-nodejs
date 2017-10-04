import { ActionInterface } from "./action-interface";
import { IotDirectiveInterface } from "../iot-directive-interface";
import { GPIOAction } from "./gpio-action"

export class WritePinAction extends GPIOAction {

    constructor(gpio: any, channel: number, protected value: boolean) {
        super(gpio, channel);
    }

    perform(message: IotDirectiveInterface<any>): Promise<any> {
        return this.gpio.setup(this.channel, this.gpio.DIR_IN, 'none').then(() => {
            return this._writePin(this.channel, this.value);
        });
    }

}