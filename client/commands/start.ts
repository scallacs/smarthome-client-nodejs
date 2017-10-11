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
    description: 'Start multiple on/off client',
})
export default class extends Command {

    execute(
        @param({
            description: 'Configuration file',
            default: 'samples/device-config.json',
            required: true,            
        })
        configFilepath: string,

        @param({
            // flag: 'p',
            description: 'Topic prefix',
            default: 'smarthome/device/',
        })
        topicPrefix: string,
        
        @param({
            // flag: 'd',
            description: 'Dry run',
            default: false,
        })
        dryRun: boolean
    ) {
        if (dryRun){
            console.warn('DRY RUN!');
        }

        configFilepath = path.resolve(configFilepath);
        if (!fs.existsSync(configFilepath)){
            throw new Error('File does not exist: ' + configFilepath);
        }

        let DEVICE_CONFIGS = JSON.parse(fs.readFileSync(configFilepath).toString());

        var gpio: any;
        try {
            gpio = require('rpi-gpio');
            gpio = gpio.promise;
        }
        catch (err) {
            console.error('Cannot load library rpi-gpio. Mocking library');
            if (!dryRun){
                process.exit(1);
            }
            gpio = {
                setup: () => {},
                write: () => {},
                read: () => {}
            };
        }
        
        console.log('Connection options: ', deviceConnOptions);

        for (let deviceConfig of DEVICE_CONFIGS) {
            let deviceId = deviceConfig.id;
            let pin = deviceConfig.pin;
            console.log('Starting ' + deviceId + '. Controlling pin ' + pin);
            let dispatcher = new DirectiveDispatcher();
            deviceConnOptions.clientId = deviceId;
            var device = new AWSMqttDevice(new awsIot.device(deviceConnOptions), topicPrefix + deviceId, dispatcher);

            console.log('Trying to connect to ' + deviceConnOptions.host);
            dispatcher.registerAction(['Alexa.PowerController.TurnOn', 'Alexa.ConnectedHome.Control.TurnOnRequest'], new DeviceAction.WritePinAction(gpio, pin, true));
            dispatcher.registerAction(['Alexa.PowerController.TurnOff', 'Alexa.ConnectedHome.Control.TurnOffRequest'], new DeviceAction.WritePinAction(gpio, pin, false));

            device.start();
        }
    }
}