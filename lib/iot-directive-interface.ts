export interface IotDirectiveInterface<PayloadType>{

    // Header related
    namespace(): string;
    name(): string;
    fullName(): string;
    payloadVersion(): string;

    endpoint(): void;

    // Payload
    payload(): PayloadType;

}