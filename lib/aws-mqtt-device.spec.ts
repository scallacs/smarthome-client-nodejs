import * as awsIot from 'aws-iot-device-sdk';
import { AWSMqttDevice } from "./aws-mqtt-device";
import * as path from 'path';
import { DirectiveDispatcher } from "./directive-dispatcher";
import { Alexa } from "./index";

declare var global: any;

describe('AwsMqttDevice', () => {
    it ('Should work', () => {
        let deviceConnOptions = {
            keyPath: path.resolve(global.APP_ROOT, 'credentials', 'private.key'),
            certPath: path.resolve(global.APP_ROOT, 'credentials', 'cert.pem'),
            caPath: path.resolve(global.APP_ROOT, 'credentials', 'public.cert.pem'),
            clientId: 'myThingNameTest',
            region: process.env['AWS_REGION'] || 'eu-west-1',
            host: "a1kai14uhgd0p5.iot.eu-west-1.amazonaws.com"
        };

        let dispatcher = new DirectiveDispatcher();
        var device = new AWSMqttDevice(new awsIot.device(deviceConnOptions), 'smarthome/device/device-1', dispatcher);

        return device.connect().then(() => {
            device.success(new Alexa.Directive({
                'header': {
                    'namespace': 'test',
                    'name': 'test'
                }
            }));
        });        
    });

    it('output topic', () => {
        // TODO
    });
});