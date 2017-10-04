
// Options
import * as path from 'path';
const APP_ROOT = path.resolve(__dirname, '..', '..');

export const config = {
    keyPath: path.resolve(APP_ROOT, 'credentials', 'private.key'),
    certPath: path.resolve(APP_ROOT, 'credentials', 'cert.pem'),
    caPath: path.resolve(APP_ROOT, 'credentials', 'public.cert.pem'),
    clientId: 'device-1',
    region: process.env['AWS_REGION'] || 'eu-west-1',
    host: "a1kai14uhgd0p5.iot.eu-west-1.amazonaws.com"
};