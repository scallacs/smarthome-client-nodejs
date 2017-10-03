import { IotDirectiveInterface } from "./iot-directive-interface";

export interface DirectiveDispatcherInterface {

    dispatch(directives: Array<IotDirectiveInterface> | IotDirectiveInterface): void;

    registerAction(actionId: string | string[], action: any): void;

}