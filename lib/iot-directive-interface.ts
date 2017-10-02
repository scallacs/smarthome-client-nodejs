export interface IotDirectiveInterface{

    // Header related
    namespace(): string;
    name(): string;
    fullName(): string;
    payloadVersion(): string;

    endpoint(): void;

    // Payload
    payload(): any;

}