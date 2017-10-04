import {
    Command,
    command,
    param,
    option
} from 'clime';

import * as path from 'path';
import * as fs from 'fs';
import * as awsIot from 'aws-iot-device-sdk';
import { DirectiveDispatcher } from "../../lib/directive-dispatcher";
import { Alexa, DeviceAction } from "../../lib/index";
import { AWSMqttDirectiveListener } from "../../lib/aws-mqtt-directive-listener";
import { IotDirectiveInterface } from "../../lib/iot-directive-interface";
import { AWSMqttDevice } from '../../lib/aws-mqtt-device';
import { config as deviceConnOptions } from '../config';

@command({
    description: 'Start client',
})
export default class extends Command {

    execute(
        @param({
            // flag: 'n',
            description: 'Device name',
            default: 'device-1',
        })
        deviceName: string,

        @param({
            // flag: 'p',
            description: 'Pin num',
            default: 16,
        })
        pin: number,

        @param({
            // flag: 'p',
            description: 'Topic prefix',
            default: 'smarthome/device/',
        })
        topicPrefix: string
    ) {
        console.log('Starting ' + deviceName + '. Controlling pin ' + pin);
        let dispatcher = new DirectiveDispatcher();
        deviceConnOptions.clientId = deviceName;

        console.log('Connection options: ', deviceConnOptions);
        var device = new AWSMqttDevice(new awsIot.device(deviceConnOptions), topicPrefix + deviceName, dispatcher);

        var gpio: any;
        try {
            gpio = require('rpi-gpio');
        }
        catch (err) {
            console.error('Cannot load library rpi-gpio. Mocking library');
            process.exit(1);
        }

        console.log('Trying to connect to ' + deviceConnOptions.host);

        dispatcher.registerAction(['Alexa.PowerController.TurnOn', 'Alexa.ConnectedHome.Control.TurnOnRequest'], new DeviceAction.WritePinAction(gpio.promise, pin, false));
        dispatcher.registerAction(['Alexa.PowerController.TurnOff', 'Alexa.ConnectedHome.Control.TurnOffRequest'], new DeviceAction.WritePinAction(gpio.promise, pin, true));

        // TODO register not available actions
        // dispatcher.registerAction('')

        device.start();
    }
}