const APP_VERSION = '0.0.1';

import * as path from 'path';
import * as fs from 'fs';
import * as awsIot from 'aws-iot-device-sdk';
import { DirectiveDispatcher } from "../lib/directive-dispatcher";
import { Alexa } from "../lib/index";
import { AWSMqttDirectiveListener } from "../lib/aws-mqtt-directive-listener";
import { IotDirectiveInterface } from "../lib/iot-directive-interface";
import { AWSMqttDevice } from '../lib/aws-mqtt-device';

console.log('Alexa Smarthome Client ');
console.log('Version: ' + APP_VERSION);

var APP_ROOT = path.resolve(__dirname, '..');

const myThingName: string = 'device-1';

let deviceConnOptions = {
    keyPath: path.resolve(APP_ROOT, 'credentials', 'private.key'),
    certPath: path.resolve(APP_ROOT, 'credentials', 'cert.pem'),
    caPath: path.resolve(APP_ROOT, 'credentials', 'public.cert.pem'),
    clientId: myThingName,
    region: process.env['AWS_REGION'] || 'eu-west-1',
    host: "a1kai14uhgd0p5.iot.eu-west-1.amazonaws.com"
};

let dispatcher = new DirectiveDispatcher();
var device = new AWSMqttDevice(new awsIot.device(deviceConnOptions), 'smarthome/device/device-1', dispatcher);

var gpio: any;
try {
    gpio = require('rpi-gpio');
}
catch (err) {
    console.error('Cannot load library rpi-gpio. Mocking library');
    // if (false){
    //     console.error(err);
    // }
    // process.exit(1);
    gpio = false;
}

let ON_OFF_PIN = 16;

if (gpio) {
    gpio.setup(ON_OFF_PIN, gpio.DIR_OUT, () => {
        console.log('Pin ' + ON_OFF_PIN + ' ready');
    });
}

console.log('Trying to connect to ' + deviceConnOptions.host);

let changePin = (directive: IotDirectiveInterface, value: boolean) => {
    device.ack(directive);
    if (gpio) {
        gpio.write(ON_OFF_PIN, value, (err: any) => {
            if (err) {
                device.failure(directive, err);
            }
            else {
                device.success(directive);
            }
        });
    }
    else {
        device.failure(directive, new Error('GPIO is not enabled on this device'));
    }
    return true;
};

dispatcher.registerAction(['Alexa.PowerController.TurnOn', 'Alexa.ConnectedHome.Control.TurnOnRequest'], (directive: IotDirectiveInterface) => {
    changePin(directive, true);
});
dispatcher.registerAction(['Alexa.PowerController.TurnOff', 'Alexa.ConnectedHome.Control.TurnOffRequest'], (directive: IotDirectiveInterface) => {
    changePin(directive, false);
});

// TODO register not available actions
// dispatcher.registerAction('')

device
    .connect()
    .then(() => {
        console.log('Connected to ' + deviceConnOptions.host + '!');
        device.listen();
    });
