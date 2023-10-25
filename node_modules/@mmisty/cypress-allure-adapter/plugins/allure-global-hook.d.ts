import { StatusDetails } from 'allure-js-commons';
import { AllureReporter } from './allure-reporter-plugin';
import { Status, StatusType } from './allure-types';
import type { ContentType } from '../common/types';
type Step = {
    name: string;
    event: 'start' | 'stop';
    date: number;
    status?: Status;
    details?: StatusDetails;
};
export declare class GlobalHooks {
    private reporter;
    hooks: {
        title: string;
        status?: Status;
        details?: StatusDetails;
        hookId?: string;
        start: number;
        stop?: number;
        steps?: Step[];
        attachments?: {
            name: string;
            file: string;
            type: ContentType;
        }[];
    }[];
    constructor(reporter: AllureReporter);
    hasHooks(): boolean;
    get currentHook(): {
        title: string;
        status?: Status | undefined;
        details?: StatusDetails | undefined;
        hookId?: string | undefined;
        start: number;
        stop?: number | undefined;
        steps?: Step[] | undefined;
        attachments?: {
            name: string;
            file: string;
            type: ContentType;
        }[] | undefined;
    } | undefined;
    get currentStep(): Step | undefined;
    start(title: string, id?: string): void;
    startStep(name: string): void;
    endStep(status?: Status, details?: StatusDetails): void;
    end(status: StatusType, details?: StatusDetails): void;
    attachment(name: string, file: string, type: ContentType): void;
    processForTest(): void;
    process(): void;
}
export {};
