import { IotDirectiveInterface } from "../iot-directive-interface";

export type ActionType = ((message: IotDirectiveInterface<any>) => Promise<any>) | ActionInterface;

export interface ActionInterface {

    perform(message: IotDirectiveInterface<any>): Promise<any> ;

}