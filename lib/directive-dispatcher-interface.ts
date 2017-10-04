import { IotDirectiveInterface } from "./iot-directive-interface";

export interface DirectiveDispatcherInterface {

    dispatch(directives: Array<IotDirectiveInterface<any>> | IotDirectiveInterface<any>): Promise<any>;

    registerAction(actionId: string | string[], action: any): void;

}