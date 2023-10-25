import { AllureTasks } from './allure-types';
export type ReporterOptions = {
    allureAddVideoOnPass: boolean;
    allureResults: string;
    techAllureResults: string;
    videos: string;
    screenshots: string;
    showDuplicateWarn: boolean;
    allureSkipSteps: string;
    isTest: boolean;
};
export declare const allureTasks: (opts: ReporterOptions) => AllureTasks;
