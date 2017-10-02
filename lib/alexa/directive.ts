import { IotDirectiveInterface } from "../iot-directive-interface";

export class Directive implements IotDirectiveInterface {

    constructor(public _data: any) {
        // console.log('Building directive with payload: ', this._data);
    }

    namespace(): string {
        return this._data['header']['namespace'];
    }
    name(): string {
        return this._data['header']['name'];
    }
    fullName(): string {
        return this.namespace() + '.' + this.name();
    }
    payloadVersion(): string {
        return this._data['header']['payloadVersion'];
    }
    endpoint(): void {
        return this._data['endpoint'];
    }
    payload() {
        return this._data['payload'];
    }

}