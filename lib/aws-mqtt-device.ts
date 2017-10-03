import { DeviceInterface } from "./device-interface";
import * as awsIot from 'aws-iot-device-sdk';
import { IotDirectiveInterface } from "./iot-directive-interface";
import { DirectiveListenerInterface } from "./directive-listener-interface";
import { DirectiveDispatcherInterface } from "./directive-dispatcher-interface";
import * as Alexa from "./alexa";
import { Granted } from "mqtt";

export class AWSMqttDevice implements DeviceInterface, DirectiveListenerInterface {

    public topic: string;

    constructor(public device: awsIot.device, topic: string, public dispatcher: DirectiveDispatcherInterface) {
        this.topic = topic;
        console.log('Building device id: ' + 'TODO');
    }

    _getOutputTopic(type: 'ack' | 'success' | 'error') {
        return this.topic + '/out/' + type;
    }
    _getInputTopic() {
        return this.topic + '/in';
    }

    ack(directive: IotDirectiveInterface): Promise<any> {
        console.log('[ACK] ' + directive.fullName());
        return this._send(this._getOutputTopic('ack'), {
            'directive': directive.fullName(),
            'status': 'ack'
        });
    }

    failure(directive: IotDirectiveInterface, error: any): Promise<any> {
        console.log('[FAILURE] ' + directive.fullName() + ' => ' + error.message);
        return this._send(this._getOutputTopic('error'), {
            'directive': directive.fullName(),
            'status': 'failure',
            'payload': {
                'message': error.message
            }
        });
    }

    success(directive: IotDirectiveInterface): Promise<any> {
        console.log('[SUCCESS] ' + directive.fullName());
        return this._send(this._getOutputTopic('success'), {
            'directive': directive.fullName(),
            'status': 'success',
            'payload': {}
        });
    }

    _send(topic: string, message: any): Promise<any> {
        if (typeof message !== 'string') {
            message = JSON.stringify(message);
        }
        this.device.publish(this.topic, message);
        return Promise.resolve();
    }

    connect(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.device
                .on('connect', function () {
                    console.log('connect');
                    resolve();
                });
            this.device.on('error', (err) => {
                reject(err);
            });
        });
    }


    disconnect(): Promise<any> {
        this.device.end();
        return Promise.resolve();
    }

    listen(): void {
        // TODO
        // if (!_isConnected){
        //     this.connect();
        // }
        this.device.on('message', (topic: string, buffer: any) => {
            let payload = buffer.toString();
            console.log('[MESSAGE] ');// => ' + payload.toString());
            console.log('\t- Topic: ', topic);
            try {
                if (typeof payload !== 'object') {
                    console.warn('\t- Received non object data type: "' + (typeof payload) + '"');
                    payload = JSON.parse(payload);
                }
            }
            catch (err) {
                console.log('\t- Cannot parse data due to error ' + err.message, payload);
                return;
            }
            try {
                console.warn('\t- Dispatching directive...');
                let directive = new Alexa.Directive(payload['directive']);
                this.dispatcher.dispatch(directive);
            }
            catch (err) {
                console.error('\t- Cannot process directive due to error: ', err.message);
                return;
            }
        });

        console.log('Subscribing to topic: ');
        console.log('\t- ' + this._getInputTopic());
        this.device.subscribe(this._getInputTopic(), undefined, (err: any, granted: Granted): void => { });
        this.device.subscribe(this._getInputTopic() + '/#', undefined, (err: any, granted: Granted): void => { });
    }

}