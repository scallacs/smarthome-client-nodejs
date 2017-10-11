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
    description: 'Single pin client controller',
})
export default class extends Command {

    execute(
        @param({
            // flag: 'n',
            description: 'Device name',
            default: 'device-1',
        })
        deviceId: string,

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
        var gpio: any;
        try {
            gpio = require('rpi-gpio');
        }
        catch (err) {
            console.error('Cannot load library rpi-gpio. Mocking library');
            process.exit(1);
        }

        deviceConnOptions.clientId = deviceId;
        console.log('Connection options: ', deviceConnOptions);
        let awsDevice = new awsIot.device(deviceConnOptions);

        console.log('Starting ' + deviceId + '. Controlling pin ' + pin);
        let dispatcher = new DirectiveDispatcher();

        var device = new AWSMqttDevice(awsDevice, topicPrefix + deviceId, dispatcher);


        console.log('Trying to connect to ' + deviceConnOptions.host);

        dispatcher.registerAction(['Alexa.PowerController.TurnOn', 'Alexa.ConnectedHome.Control.TurnOnRequest'], new DeviceAction.WritePinAction(gpio.promise, pin, true));
        dispatcher.registerAction(['Alexa.PowerController.TurnOff', 'Alexa.ConnectedHome.Control.TurnOffRequest'], new DeviceAction.WritePinAction(gpio.promise, pin, false));

        // TODO register not available actions
        // dispatcher.registerAction('')

        device.start();
    }
}