/// <reference types="cypress" />
/// <reference types="node" />
/// <reference types="cypress" />
import { AllureTransfer, EnvironmentInfo, ExecutorInfo, RequestTask, Status, Category } from '../plugins/allure-types';
export declare const allureInterface: (env: Record<string, string>, fn: <T extends keyof {
    specStarted: {
        spec: Cypress.Spec;
    };
    writeEnvironmentInfo: {
        info: EnvironmentInfo;
    };
    writeExecutorInfo: {
        info: ExecutorInfo;
    };
    writeCategoriesDefinitions: {
        categories: string | Category[];
    };
    testEnded: {
        result: Status;
        details?: import("allure-js-commons").StatusDetails | undefined;
    };
    testStarted: {
        title: string;
        fullTitle: string;
        id: string;
        currentRetry?: number | undefined;
    };
    suiteStarted: {
        title: string;
        fullTitle: string;
        file?: string | undefined;
    };
    hookStarted: {
        title: string;
        file?: string | undefined;
        hookId?: string | undefined;
        date?: number | undefined;
    };
    hookEnded: {
        title: string;
        date?: number | undefined;
        result: Status;
        details?: import("allure-js-commons").StatusDetails | undefined;
    };
    suiteEnded: undefined;
    deleteResults: undefined;
    stepEnded: {
        status: Status;
        date?: number | undefined;
        details?: import("allure-js-commons").StatusDetails | undefined;
    };
    mergeStepMaybe: {
        name: string;
    };
    stepStarted: {
        name: string;
        date?: number | undefined;
    };
    step: {
        name: string;
        status?: string | undefined;
        date?: number | undefined;
    };
    parameter: {
        name: string;
        value: string;
    };
    fullName: {
        value: string;
    };
    link: {
        url: string;
        name?: string | undefined;
        type?: import("../plugins/allure-types").LinkType | undefined;
    };
    testParameter: {
        name: string;
        value: string;
    };
    testStatus: {
        result: Status;
        details?: import("allure-js-commons").StatusDetails | undefined;
    };
    testDetails: {
        details?: import("allure-js-commons").StatusDetails | undefined;
    };
    testAttachment: {
        name: string;
        content: string | Buffer;
        type: string;
    };
    testFileAttachment: {
        name: string;
        file: string;
        type: import("../common/types").ContentType;
    };
    fileAttachment: {
        name: string;
        file: string;
        type: import("../common/types").ContentType;
    };
    attachment: {
        name: string;
        content: string | Buffer;
        type: string;
    };
    addDescriptionHtml: {
        value: string;
    };
    label: {
        name: string;
        value: string;
    };
    message: {
        name: string;
    };
    suite: {
        name?: string | undefined;
    };
    subSuite: {
        name?: string | undefined;
    };
    parentSuite: {
        name?: string | undefined;
    };
    testMessage: {
        path: string;
        message: string;
    };
    delete: {
        path: string;
    };
    attachScreenshots: {
        screenshots: import("../plugins/allure-types").AutoScreen[];
    };
    screenshotOne: {
        name: string;
        forStep?: boolean | undefined;
    };
    testResult: {
        title: string;
        id: string;
        result: Status;
        details?: import("allure-js-commons").StatusDetails | undefined;
    };
    endAll: undefined;
    afterSpec: {
        results: CypressCommandLine.RunResult;
    };
}>(data: string | AllureTransfer<T>) => void) => Cypress.AllureReporter<void>;
export declare const registerStubReporter: () => void;
export declare const registerMochaReporter: (ws: WebSocket) => void;
