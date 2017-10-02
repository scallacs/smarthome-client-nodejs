const APP_VERSION = '0.0.1';

import * as path from 'path';
import * as fs from 'fs';
import * as awsIot from 'aws-iot-device-sdk';
import { DirectiveDispatcher } from "../lib/directive-dispatcher";
import { Alexa } from "../lib/index";
import { AWSMqttDirectiveListener } from "../lib/aws-mqtt-directive-listener";
import { IotDirectiveInterface } from "../lib/iot-directive-interface";

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

var device = new awsIot.device(deviceConnOptions);

var gpio = require('rpi-gpio');
let ON_OFF_PIN = 16;

gpio.setup(ON_OFF_PIN, gpio.DIR_OUT, () => {
    console.log('Pin ' + ON_OFF_PIN + ' ready');
});

console.log('Trying to connecto to ' + deviceConnOptions.host);
device
    .on('connect', function () {
        console.log('Connected to ' + deviceConnOptions.host + '!');
        let dispatcher = new DirectiveDispatcher();

        dispatcher.registerAction('Alexa.PowerController', 'TurnOn', (directive: IotDirectiveInterface) => {
            console.log('Alexa.PowerController.TurnOn');
            gpio.write(ON_OFF_PIN, true, (err: any) => {
                if (err){
                    console.log('Error: ', err);
                    return;
                }
            });
            return true;
        });
        dispatcher.registerAction('Alexa.PowerController', 'TurnOff', (directive: IotDirectiveInterface) => {
            console.log('Alexa.PowerController.TurnOff');
            gpio.write(ON_OFF_PIN, true, (err: any) => {
                if (err){
                    console.log('Error: ', err);
                    return;
                }
            });
            return true;
        });

        let client = new AWSMqttDirectiveListener(device, dispatcher);
        client.listen();
    });
