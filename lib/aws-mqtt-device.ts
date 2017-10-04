import { DeviceInterface } from "./device-interface";
import * as awsIot from 'aws-iot-device-sdk';
import { IotDirectiveInterface } from "./iot-directive-interface";
import { DirectiveListenerInterface } from "./directive-listener-interface";
import { DirectiveDispatcherInterface } from "./directive-dispatcher-interface";
import * as Alexa from "./alexa";
import { Granted } from "mqtt";

export class AWSMqttDevice implements DeviceInterface, DirectiveListenerInterface {

    public topic: string;

    constructor(
        public awsDevice: awsIot.device,
        topic: string,
        public dispatcher: DirectiveDispatcherInterface) {
        this.topic = topic;
        console.log('Building device id: ' + 'TODO');
    }

    _getOutputTopic(type: 'ack' | 'success' | 'error') {
        return this.topic + '/out/' + type;
    }
    _getInputTopic() {
        return this.topic + '/in';
    }

    start() {
        return this
            .connect()
            .then(() => {
                console.log('Connected to endpoint!');
                this.listen();
            });
    }

    ack(directive: IotDirectiveInterface<any>): Promise<any> {
        console.log('[ACK] ' + directive.fullName());
        return this._send(this._getOutputTopic('ack'), {
            'directive': directive.fullName(),
            'status': 'ack'
        });
    }

    failure(directive: IotDirectiveInterface<any>, error: any): Promise<any> {
        console.log('[FAILURE] ' + directive.fullName() + ' => ' + error.message);
        return this._send(this._getOutputTopic('error'), {
            'directive': directive.fullName(),
            'status': 'failure',
            'payload': {
                'message': error.message
            }
        });
    }

    success(directive: IotDirectiveInterface<any>): Promise<any> {
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
        console.log('\t- Send on topic ' + topic);
        this.awsDevice.publish(this.topic, message);
        return Promise.resolve();
    }

    connect(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.awsDevice
                .on('connect', function () {
                    console.log('connect');
                    resolve();
                });
            this.awsDevice.on('error', (err) => {
                reject(err);
            });
        });
    }


    disconnect(): Promise<any> {
        this.awsDevice.end();
        return Promise.resolve();
    }

    listen(): void {
        // TODO
        // if (!_isConnected){
        //     this.connect();
        // }
        this.awsDevice.on('message', (topic: string, buffer: any) => {
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
                // TODO change constructeur
                let directive = new Alexa.Directive(payload['directive']);
                let promise = this.dispatcher.dispatch(directive);

                promise
                    .then(() => {
                        this.success(directive);
                    })
                    .catch((err) => {
                        this.failure(directive, err);
                    });
            }
            catch (err) {
                console.error('\t- Cannot process directive due to error: ', err.message);
                return;
            }
        });

        console.log('Subscribing to topic: ');
        console.log('\t- ' + this._getInputTopic());
        this.awsDevice.subscribe(this._getInputTopic(), undefined, (err: any, granted: Granted): void => { });
        this.awsDevice.subscribe(this._getInputTopic() + '/#', undefined, (err: any, granted: Granted): void => { });
    }

}