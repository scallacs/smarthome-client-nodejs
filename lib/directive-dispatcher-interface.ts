import { IotDirectiveInterface } from "./iot-directive-interface";

export interface DirectiveDispatcherInterface {

    dispatch(directives: Array<IotDirectiveInterface> | IotDirectiveInterface): void;

    registerAction(namespace: string, name: string, action: any): void;

}