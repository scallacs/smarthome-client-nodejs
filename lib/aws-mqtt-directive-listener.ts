import { DirectiveListenerInterface } from "./directive-listener-interface";
import * as awsIot from 'aws-iot-device-sdk';
import { Alexa } from "./index";
import { DirectiveDispatcherInterface } from "./directive-dispatcher-interface";

export class AWSMqttDirectiveListener implements DirectiveListenerInterface {

    constructor(public device: awsIot.device, public dispatcher: DirectiveDispatcherInterface) {

    }

    listen(): void {
        this.device.on('error', (err: any) => {
            console.log('Error', err);
        });

        this.device.on('message', (topic: string, payload: any) => {
            // console.log('\t-' + topic);
            try {
                payload = JSON.parse(payload);
                let directive = new Alexa.Directive(payload['directive']);
                this.dispatcher.dispatch(directive);
            }
            catch (ex) {
                console.log('Cannot parse ', payload);
            }
        });

        this.device.subscribe('smartlight/device-1/in', (message: any) => {
            // TODO 
        });
    }

}