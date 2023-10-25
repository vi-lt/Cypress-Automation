import type { ContentType } from '../common/types';
export declare const wsPath = "/__cypress/allure_messages/";
export declare const ENV_WS = "allureWsPort";
export declare const packageLog = "[cypress-allure-adapter]";
type Message = {
    data: any;
    id: number;
};
export declare class MessageQueue {
    private id;
    private messages;
    enqueue(data: any): void;
    dequeueAll(): Message[] | undefined;
}
export declare const tmsIssueUrl: (env: Record<string, string>, value: string, type: 'issue' | 'tms') => string;
export declare const extname: (path: string) => string;
export declare const basename: (path: string) => string;
export declare function delay(ms: number): Promise<void>;
export declare const getContentType: (file: string) => ContentType;
export declare const swapItems: (arr: unknown[], index1: number, index2: number) => void;
export declare const baseUrlFromUrl: (url: string) => string;
export {};
