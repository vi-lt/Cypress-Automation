import type { AllureTransfer, RequestTask } from '../plugins/allure-types';
export declare const startWsClient: () => WebSocket | undefined;
export type MessageManager = {
    stop: () => void;
    process: () => void;
    message: <T extends RequestTask>(data: AllureTransfer<T> | string) => void;
};
export declare const createMessage: (ws: WebSocket) => MessageManager;
