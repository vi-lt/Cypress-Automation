"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCommands = void 0;
const registerCommands = () => {
    Cypress.Commands.add('allure', () => {
        const allure = Cypress.Allure;
        cy.wrap(allure, {
            log: false,
        });
    });
    const childCommands = {
        parameter: (allure, name, value) => allure.parameter(name, value),
        parameters: (allure, ...params) => allure.parameters(...params),
        testParameter: (allure, name, value) => allure.testParameter(name, value),
        addDescriptionHtml: (allure, value) => allure.addDescriptionHtml(value),
        // testName: (allure, name) => allure.testName(name),
        host: (allure, value) => allure.host(value),
        deleteResults: allure => allure.deleteResults(),
        language: (allure, value) => allure.language(value),
        severity: (allure, value) => allure.severity(value),
        epic: (allure, value) => allure.epic(value),
        feature: (allure, value) => allure.feature(value),
        link: (allure, value, name, type) => allure.link(value, name, type),
        tms: (allure, value, name) => allure.tms(value, name),
        issue: (allure, value, name) => allure.issue(value, name),
        story: (allure, value) => allure.story(value),
        suite: (allure, name) => allure.suite(name),
        subSuite: (allure, name) => allure.subSuite(name),
        parentSuite: (allure, name) => allure.parentSuite(name),
        thread: (allure, value) => allure.thread(value),
        allureId: (allure, value) => allure.allureId(value),
        // testID: (allure, id) => allure.label('AS_ID', id),
        testStatus: (allure, result, details) => allure.testStatus(result, details),
        testDetails: (allure, details) => allure.testDetails(details),
        testAttachment: (allure, name, content, type) => allure.testAttachment(name, content, type),
        testFileAttachment: (allure, name, file, type) => allure.testFileAttachment(name, file, type),
        fileAttachment: (allure, name, file, type) => allure.fileAttachment(name, file, type),
        attachment: (allure, name, content, type) => allure.attachment(name, content, type),
        owner: (allure, name) => allure.owner(name),
        fullName: (allure, name) => allure.fullName(name),
        lead: (allure, name) => allure.lead(name),
        layer: (allure, name) => allure.layer(name),
        browser: (allure, name) => allure.browser(name),
        device: (allure, name) => allure.device(name),
        os: (allure, name) => allure.os(name),
        startStep: (allure, name) => allure.startStep(name),
        step: (allure, name, status) => allure.step(name, status),
        endStep: (allure, status) => allure.endStep(status),
        mergeStepMaybe: (allure, name) => allure.mergeStepMaybe(name),
        label: (allure, name, value) => allure.label(name, value),
        //description: (allure, markdown) => allure.description(markdown),
        tag: (allure, ...tags) => allure.tag(...tags),
        writeEnvironmentInfo: (allure, info) => allure.writeEnvironmentInfo(info),
        writeExecutorInfo: (allure, info) => allure.writeExecutorInfo(info),
        writeCategoriesDefinitions: (allure, categories) => allure.writeCategoriesDefinitions(categories),
    };
    for (const command in childCommands) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cmd = command;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Cypress.Commands.add(cmd, { prevSubject: true }, (...args) => {
            const [allure, ...params] = args;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            childCommands[command](allure, ...params);
            cy.wrap(allure, { log: false });
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getPrevSubjects = (cmd, arr = []) => {
        var _a, _b;
        arr.unshift((_a = cmd === null || cmd === void 0 ? void 0 : cmd.attributes) === null || _a === void 0 ? void 0 : _a.subject);
        if ((_b = cmd === null || cmd === void 0 ? void 0 : cmd.attributes) === null || _b === void 0 ? void 0 : _b.prev) {
            return getPrevSubjects(cmd.attributes.prev, arr);
        }
        return arr;
    };
    // not changing the subject
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Cypress.Commands.add('doSyncCommand', function (syncFn) {
        var _a;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // const queue = () => (cy as any).queue.queueables;
        // const commandsCount = queue().length;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subjs = getPrevSubjects((_a = cy.state()) === null || _a === void 0 ? void 0 : _a.current);
        let prevSubj = undefined;
        if (subjs.length > 1) {
            prevSubj = subjs[subjs.length - 2];
        }
        syncFn(prevSubj);
        /* if (queue().length > commandsCount) {
          console.warn(
            'Using cypress async commands inside `cy.doSyncCommand` my change the subject ' +
              'and retries will not be done for the chain. To avoid this warning ' +
              'do not use cy.<command> here, instead you can use Cypress.<command>',
          );
        } */
        return prevSubj;
    });
};
exports.registerCommands = registerCommands;
