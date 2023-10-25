"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMochaReporter = exports.registerStubReporter = exports.allureInterface = void 0;
const websocket_1 = require("./websocket");
const cypress_events_1 = require("./cypress-events");
const allure_types_1 = require("../plugins/allure-types"); // todo
const screenshots_1 = require("./screenshots");
const helper_1 = require("./helper");
const common_1 = require("../common");
const events_1 = require("events");
const dbg = 'cypress-allure:mocha-reporter';
// this is running in Browser
const TEST_PENDING_DETAILS = 'Test ignored';
const MOCHA_EVENTS = {
    RUN_BEGIN: 'start',
    SUITE_BEGIN: 'suite',
    HOOK_START: 'hook',
    HOOK_END: 'hook end',
    TEST_BEGIN: 'test',
    TEST_FAIL: 'fail',
    TEST_PASS: 'pass',
    TEST_RETRY: 'retry',
    TEST_END: 'test end',
    TEST_PENDING: 'pending',
    SUITE_END: 'suite end',
    RUN_END: 'end',
};
const CUSTOM_EVENTS = {
    TEST_BEGIN: 'test begin allure',
    TEST_FAIL: 'test fail allure',
    TEST_PASS: 'test pass allure',
    TEST_END: 'test end allure',
    HOOK_END: 'hook end allure',
    TASK: 'task',
    GLOBAL_HOOK_FAIL: 'global hook fail',
};
const USER_EVENTS = {
    TEST_START: 'test:started',
    TEST_END: 'test:ended',
    CMD_END: 'cmd:ended',
    CMD_START: 'cmd:started',
};
const convertState = (state) => {
    if (state === 'pending') {
        return allure_types_1.Status.SKIPPED;
    }
    return state; // todo
};
const isRootSuite = (suite) => {
    return suite.fullTitle() === '';
};
const isRootSuiteTest = (test) => {
    var _a;
    return ((_a = test.parent) === null || _a === void 0 ? void 0 : _a.title) === '';
};
const allureEventsEmitter = new events_1.EventEmitter();
const eventsInterfaceInstance = (isStub) => ({
    on: (event, testHandler) => {
        const debug = (0, helper_1.logClient)(dbg);
        if (isStub &&
            ![USER_EVENTS.TEST_START, USER_EVENTS.TEST_END, USER_EVENTS.CMD_END, USER_EVENTS.CMD_START].includes(event)) {
            return;
        }
        debug(`ADD LISTENER: ${event}`);
        allureEventsEmitter.addListener(event, testHandler);
    },
});
const allureInterface = (env, fn) => {
    return {
        writeEnvironmentInfo: (info) => fn({ task: 'writeEnvironmentInfo', arg: { info } }),
        writeExecutorInfo: (info) => fn({ task: 'writeExecutorInfo', arg: { info } }),
        writeCategoriesDefinitions: (categories) => fn({ task: 'writeCategoriesDefinitions', arg: { categories } }),
        startStep: (name) => fn({ task: 'stepStarted', arg: { name, date: Date.now() } }),
        // remove from interface
        mergeStepMaybe: (name) => fn({ task: 'mergeStepMaybe', arg: { name } }),
        endStep: (status) => fn({ task: 'stepEnded', arg: { status: status !== null && status !== void 0 ? status : allure_types_1.Status.PASSED, date: Date.now() } }),
        step: (name, status) => fn({ task: 'step', arg: { name, status: status !== null && status !== void 0 ? status : allure_types_1.Status.PASSED, date: Date.now() } }),
        deleteResults: () => fn({ task: 'deleteResults', arg: {} }),
        fullName: (value) => fn({ task: 'fullName', arg: { value } }),
        testAttachment: (name, content, type) => fn({ task: 'testAttachment', arg: { name, content, type } }),
        testStatus: (result, details) => fn({ task: 'testStatus', arg: { result, details } }),
        testDetails: (details) => fn({ task: 'testDetails', arg: { details } }),
        testFileAttachment: (name, file, type) => fn({ task: 'testFileAttachment', arg: { name, file, type } }),
        fileAttachment: (name, file, type) => fn({ task: 'fileAttachment', arg: { name, file, type } }),
        attachment: (name, content, type) => fn({ task: 'attachment', arg: { name, content, type } }),
        parameter: (name, value) => fn({ task: 'parameter', arg: { name, value } }),
        parameters: (...params) => params.forEach(p => fn({ task: 'parameter', arg: { name: p.name, value: p.value } })),
        testParameter(name, value) {
            fn({ task: 'testParameter', arg: { name, value } });
        },
        addDescriptionHtml(value) {
            fn({ task: 'addDescriptionHtml', arg: { value } });
        },
        link: (url, name, type) => fn({ task: 'link', arg: { url, name, type } }),
        tms: (url, name) => fn({ task: 'link', arg: { url: (0, common_1.tmsIssueUrl)(env, url, 'tms'), name: name !== null && name !== void 0 ? name : url, type: 'tms' } }),
        issue: (url, name) => fn({ task: 'link', arg: { url: (0, common_1.tmsIssueUrl)(env, url, 'issue'), name: name !== null && name !== void 0 ? name : url, type: 'issue' } }),
        label: (name, value) => fn({ task: 'label', arg: { name, value } }),
        suite: (name) => fn({ task: 'suite', arg: { name } }),
        parentSuite: (name) => fn({ task: 'parentSuite', arg: { name } }),
        subSuite: (name) => fn({ task: 'subSuite', arg: { name } }),
        tag: (...tags) => tags.forEach(tag => fn({ task: 'label', arg: { name: allure_types_1.LabelName.TAG, value: tag } })),
        severity: (value) => fn({ task: 'label', arg: { name: allure_types_1.LabelName.SEVERITY, value } }),
        language: (value) => fn({ task: 'label', arg: { name: allure_types_1.LabelName.LANGUAGE, value } }),
        owner: (value) => fn({ task: 'label', arg: { name: allure_types_1.LabelName.OWNER, value } }),
        os: (value) => fn({ task: 'label', arg: { name: 'os', value } }),
        host: (value) => fn({ task: 'label', arg: { name: allure_types_1.LabelName.HOST, value } }),
        layer: (value) => fn({ task: 'label', arg: { name: allure_types_1.LabelName.LAYER, value } }),
        browser: (value) => fn({ task: 'label', arg: { name: 'browser', value } }),
        device: (value) => fn({ task: 'label', arg: { name: 'device', value } }),
        lead: (value) => fn({ task: 'label', arg: { name: allure_types_1.LabelName.LEAD, value } }),
        feature: (value) => fn({ task: 'label', arg: { name: allure_types_1.LabelName.FEATURE, value } }),
        story: (value) => fn({ task: 'label', arg: { name: allure_types_1.LabelName.STORY, value } }),
        epic: (value) => fn({ task: 'label', arg: { name: allure_types_1.LabelName.EPIC, value } }),
        allureId: (value) => fn({ task: 'label', arg: { name: allure_types_1.LabelName.ALLURE_ID, value } }),
        thread: (value) => fn({ task: 'label', arg: { name: allure_types_1.LabelName.THREAD, value } }),
    };
};
exports.allureInterface = allureInterface;
const registerStubReporter = () => {
    Cypress.Allure = Object.assign(Object.assign({}, (0, exports.allureInterface)(Cypress.env(), () => {
        // do nothing when no allure reporting enabled
    })), eventsInterfaceInstance(true));
};
exports.registerStubReporter = registerStubReporter;
const isBeforeAllHook = (test) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return test.type === 'hook' && test.hookName === 'before all';
};
const isBeforeEachHook = (test) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return test.type === 'hook' && test.hookName === 'before each';
};
const isHook = (test) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return test.type === 'hook';
};
const createTests = (runner, test) => {
    var _a;
    let index = 0;
    (_a = test.parent) === null || _a === void 0 ? void 0 : _a.eachTest(ts => {
        ts.err = test.err;
        index++;
        if (ts) {
            if (index === 1) {
                ts.state = 'failed';
            }
            runner.emit(CUSTOM_EVENTS.TEST_BEGIN, ts);
            runner.emit(CUSTOM_EVENTS.TEST_FAIL, ts);
            runner.emit(CUSTOM_EVENTS.TEST_END, ts);
        }
    });
};
const createTestsBeforeEach = (runner, test) => {
    var _a;
    let index = 0;
    (_a = test.parent) === null || _a === void 0 ? void 0 : _a.eachTest(ts => {
        ts.err = test.err;
        index++;
        if (index !== 1 && ts) {
            runner.emit(CUSTOM_EVENTS.TEST_BEGIN, ts);
            runner.emit(CUSTOM_EVENTS.TEST_FAIL, ts);
            runner.emit(CUSTOM_EVENTS.TEST_END, ts);
        }
    });
};
const createTestsForSuite = (runner, testOrHook, suite) => {
    // let index = 0;
    runner.emit(CUSTOM_EVENTS.TASK, { task: 'endAll', arg: {} });
    runner.emit(MOCHA_EVENTS.SUITE_BEGIN, suite);
    suite === null || suite === void 0 ? void 0 : suite.eachTest(ts => {
        ts.err = testOrHook.err;
        // index++;
        if (ts) {
            runner.emit(CUSTOM_EVENTS.TEST_BEGIN, ts);
            runner.emit(CUSTOM_EVENTS.TEST_FAIL, ts);
            runner.emit(CUSTOM_EVENTS.TEST_END, ts);
        }
    });
    runner.emit(MOCHA_EVENTS.SUITE_END, suite);
};
const sendMessageTestCreator = (messageManager, specPathLog) => (msg) => {
    if (isJestTest()) {
        messageManager.message({ task: 'testMessage', arg: { path: specPathLog, message: msg } });
    }
};
const isJestTest = () => {
    return Cypress.env('JEST_TEST') === 'true' || Cypress.env('JEST_TEST') === true;
};
const registerTestEvents = (messageManager, specPathLog) => {
    if (isJestTest()) {
        const msg = sendMessageTestCreator(messageManager, specPathLog);
        Cypress.Allure.on('test:started', () => {
            msg('plugin test:started');
        });
        Cypress.Allure.on('test:ended', () => {
            msg('plugin test:ended');
        });
    }
};
const registerMochaReporter = (ws) => {
    const tests = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const runner = Cypress.mocha.getRunner();
    runner.setMaxListeners(20);
    const messageManager = (0, websocket_1.createMessage)(ws);
    const message = messageManager.message;
    allureEventsEmitter.removeAllListeners();
    const allureInterfaceInstance = (0, exports.allureInterface)(Cypress.env(), message);
    const allureEvents = eventsInterfaceInstance(false);
    Cypress.Allure = Object.assign(Object.assign({}, allureInterfaceInstance), allureEvents);
    (0, screenshots_1.registerScreenshotHandler)();
    const startedSuites = [];
    const specPathLog = `reports/test-events/${Cypress.spec.name}.log`;
    const debug = (0, helper_1.logClient)(dbg);
    if (isJestTest()) {
        messageManager.message({ task: 'delete', arg: { path: specPathLog } });
    }
    const sendMessageTest = sendMessageTestCreator(messageManager, specPathLog);
    let createTestsCallb = undefined;
    registerTestEvents(messageManager, specPathLog);
    runner
        .once(MOCHA_EVENTS.RUN_BEGIN, () => {
        debug(`event ${MOCHA_EVENTS.RUN_BEGIN}`);
        sendMessageTest(`mocha: ${MOCHA_EVENTS.RUN_BEGIN}`);
        runner.emit(CUSTOM_EVENTS.TASK, { task: 'endAll', arg: {} });
        runner.emit(CUSTOM_EVENTS.TASK, { task: 'specStarted', arg: { spec: Cypress.spec } });
        messageManager.process();
    })
        .on(MOCHA_EVENTS.SUITE_BEGIN, suite => {
        debug(`event ${MOCHA_EVENTS.SUITE_BEGIN}: ${suite.title}, ${suite.fullTitle()}`);
        sendMessageTest(`mocha: ${MOCHA_EVENTS.SUITE_BEGIN}: ${suite.title}, ${suite.fullTitle()}`);
        if (isRootSuite(suite)) {
            runner.emit(CUSTOM_EVENTS.TASK, { task: 'endAll', arg: {} });
            return;
        }
        startedSuites.push(suite);
        runner.emit(CUSTOM_EVENTS.TASK, {
            task: 'suiteStarted',
            arg: { title: suite.title, fullTitle: suite.fullTitle(), file: suite.file },
        });
    })
        .on(MOCHA_EVENTS.HOOK_START, hook => {
        debug(`event ${MOCHA_EVENTS.HOOK_START}: ${hook.title}`);
        sendMessageTest(`mocha: ${MOCHA_EVENTS.HOOK_START}: ${hook.title}`);
        if (isBeforeAllHook(hook) && isRootSuiteTest(hook)) {
            debug('GLOBAL BEFORE ALL - end all existing');
            runner.emit(CUSTOM_EVENTS.TASK, { task: 'endAll', arg: {} });
        }
        runner.emit(CUSTOM_EVENTS.TASK, {
            task: 'hookStarted',
            arg: { title: hook.title, file: hook.file, hookId: hook.hookId },
        });
    })
        .on(MOCHA_EVENTS.HOOK_END, hook => {
        // this event is not fired when hook fails
        debug(`event ${MOCHA_EVENTS.HOOK_END}: ${hook.title}`);
        sendMessageTest(`mocha: ${MOCHA_EVENTS.HOOK_END}: ${hook.title}`);
        if (isBeforeAllHook(hook) && isRootSuiteTest(hook)) {
            debug('GLOBAL BEFORE ALL - end all existing ');
            runner.emit(CUSTOM_EVENTS.TASK, { task: 'endAll', arg: {} });
        }
        runner.emit(CUSTOM_EVENTS.TASK, {
            task: 'hookEnded',
            // since event is not fired when hook fails always passed here
            arg: { title: hook.title, result: allure_types_1.Status.PASSED },
        });
    })
        .on(MOCHA_EVENTS.TEST_PENDING, test => {
        debug(`event ${MOCHA_EVENTS.TEST_PENDING}: ${test.title}`);
        sendMessageTest(`mocha: ${MOCHA_EVENTS.TEST_PENDING}: ${test.title}`);
        // ignore
    })
        .on(MOCHA_EVENTS.TEST_BEGIN, (test) => {
        // no event when global hook fails
        debug(`event ${MOCHA_EVENTS.TEST_BEGIN}: ${test.title}`);
        sendMessageTest(`mocha: ${MOCHA_EVENTS.TEST_BEGIN}: ${test.title}`);
        debug(`${JSON.stringify(tests)}`);
        runner.emit(CUSTOM_EVENTS.TEST_BEGIN, test);
    })
        .on(MOCHA_EVENTS.TEST_FAIL, (test) => {
        debug(`event ${MOCHA_EVENTS.TEST_FAIL}: ${test === null || test === void 0 ? void 0 : test.title}`);
        sendMessageTest(`mocha: ${MOCHA_EVENTS.TEST_FAIL}: ${test === null || test === void 0 ? void 0 : test.title}`);
        if (isBeforeEachHook(test)) {
            runner.emit(CUSTOM_EVENTS.TEST_FAIL, test);
            // hook end not fired when hook fails
            runner.emit(CUSTOM_EVENTS.HOOK_END, test);
            // when before each fails all tests are skipped in current suite
            // will create synthetic tests after test ends in cypress event
            createTestsCallb = () => createTestsBeforeEach(runner, test);
            return;
        }
        if (isBeforeAllHook(test)) {
            // hook end not fired when hook fails
            runner.emit(CUSTOM_EVENTS.HOOK_END, test);
            if (isRootSuiteTest(test)) {
                // only for root suite
                runner.emit(CUSTOM_EVENTS.GLOBAL_HOOK_FAIL, test);
                return;
            }
            createTestsCallb = () => createTests(runner, test);
            return;
        }
        runner.emit(CUSTOM_EVENTS.TEST_FAIL, test);
        // hook end not fired when hook fails
        if (isHook(test)) {
            runner.emit(CUSTOM_EVENTS.HOOK_END, test);
        }
        return;
    })
        .on(MOCHA_EVENTS.TEST_RETRY, test => {
        debug(`event ${MOCHA_EVENTS.TEST_RETRY}: ${test.title}`);
        sendMessageTest(`mocha: ${MOCHA_EVENTS.TEST_RETRY}: ${test.title}`);
        runner.emit(CUSTOM_EVENTS.TEST_FAIL, test);
    })
        .on(MOCHA_EVENTS.TEST_PASS, test => {
        debug(`event ${MOCHA_EVENTS.TEST_PASS}: ${test.title}`);
        sendMessageTest(`mocha: ${MOCHA_EVENTS.TEST_PASS}: ${test.title}`);
        runner.emit(CUSTOM_EVENTS.TASK, {
            task: 'testResult',
            arg: {
                title: test.title,
                id: test.id,
                result: convertState('passed'),
            },
        });
    })
        .on(MOCHA_EVENTS.TEST_END, test => {
        debug(`event ${MOCHA_EVENTS.TEST_END}: ${test.title}`);
        sendMessageTest(`mocha: ${MOCHA_EVENTS.TEST_END}: ${test.title}`);
    })
        .on(MOCHA_EVENTS.SUITE_END, suite => {
        debug(`event ${MOCHA_EVENTS.SUITE_END}: ${suite.title} ${suite.file}`);
        sendMessageTest(`mocha: ${MOCHA_EVENTS.SUITE_END}: ${suite.title}`);
        if (isRootSuite(suite)) {
            //end run
            runner.emit(CUSTOM_EVENTS.TASK, { task: 'suiteEnded', arg: {} });
            runner.emit(CUSTOM_EVENTS.TASK, { task: 'message', arg: { name: 'RUN_END' } });
            return;
        }
        if (startedSuites.length === 1) {
            // startedSuites doesn't include root suite
            // will end later with run end since there are more
            // events after suite finished
            return;
        }
        startedSuites.pop();
        runner.emit(CUSTOM_EVENTS.TASK, { task: 'suiteEnded', arg: {} });
    })
        .on(MOCHA_EVENTS.RUN_END, () => {
        // note that Coverage tasks doesn't work here anymore
        // since they use after and afterEach hooks
        debug(`event ${MOCHA_EVENTS.RUN_END}: tests length ${tests.length}`);
        sendMessageTest(`mocha: ${MOCHA_EVENTS.RUN_END}`);
        messageManager.stop();
    });
    // custom events
    runner
        .on(CUSTOM_EVENTS.HOOK_END, hook => {
        var _a, _b;
        debug(`event ${CUSTOM_EVENTS.HOOK_END}: ${hook.title}`);
        message({
            task: 'hookEnded',
            arg: {
                title: hook.title,
                result: hook.err ? allure_types_1.Status.FAILED : allure_types_1.Status.PASSED,
                details: {
                    message: (_a = hook.err) === null || _a === void 0 ? void 0 : _a.message,
                    trace: (_b = hook.err) === null || _b === void 0 ? void 0 : _b.stack,
                },
            },
        });
    })
        .once(CUSTOM_EVENTS.GLOBAL_HOOK_FAIL, hook => {
        var _a;
        debug(`event ${CUSTOM_EVENTS.GLOBAL_HOOK_FAIL}: ${hook.title}`);
        for (const sui of (_a = hook.parent) === null || _a === void 0 ? void 0 : _a.suites) {
            createTestsCallb = () => createTestsForSuite(runner, hook, sui);
        }
    })
        .on(CUSTOM_EVENTS.TEST_BEGIN, test => {
        debug(`event ${CUSTOM_EVENTS.TEST_BEGIN}: ${test.title}`);
        message({
            task: 'testStarted',
            arg: { title: test.title, fullTitle: test.fullTitle(), id: test.id, currentRetry: test._currentRetry },
        });
        allureEventsEmitter.emit(USER_EVENTS.TEST_START, test, () => {
            debug('After start callback');
        });
    })
        .on(CUSTOM_EVENTS.TASK, payload => {
        debug(`event ${CUSTOM_EVENTS.TASK}`);
        debug(payload);
        message(payload);
    })
        .on(CUSTOM_EVENTS.TEST_FAIL, (test) => {
        var _a, _b;
        debug(`event ${CUSTOM_EVENTS.TEST_FAIL}: ${test.title}`);
        message({
            task: 'testResult',
            arg: {
                title: test === null || test === void 0 ? void 0 : test.title,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                id: test === null || test === void 0 ? void 0 : test.id,
                result: convertState('failed'),
                details: { message: (_a = test === null || test === void 0 ? void 0 : test.err) === null || _a === void 0 ? void 0 : _a.message, trace: (_b = test === null || test === void 0 ? void 0 : test.err) === null || _b === void 0 ? void 0 : _b.stack },
            },
        });
    })
        .on(CUSTOM_EVENTS.TEST_END, test => {
        debug(`event ${CUSTOM_EVENTS.TEST_END}: ${test.title}`);
        tests.pop();
        allureEventsEmitter.emit(USER_EVENTS.TEST_END, test);
        const detailsErr = test.err;
        const testState = convertState(test.state);
        const detailsMessage = (msg) => (!msg && testState === 'skipped' ? TEST_PENDING_DETAILS : msg);
        message({
            task: 'testEnded',
            arg: {
                result: testState,
                details: {
                    message: detailsMessage(detailsErr === null || detailsErr === void 0 ? void 0 : detailsErr.message),
                    trace: detailsErr === null || detailsErr === void 0 ? void 0 : detailsErr.stack,
                },
            },
        });
    });
    if (isJestTest()) {
        Cypress.on('test:before:run', (_t, test) => {
            sendMessageTest(`cypress: test:before:run: ${test.title}`);
        });
    }
    Cypress.on('test:after:run', (_t, test) => {
        sendMessageTest(`cypress: test:after:run: ${test.title}`);
        runner.emit(CUSTOM_EVENTS.TEST_END, test);
        if (createTestsCallb) {
            createTestsCallb();
            createTestsCallb = undefined;
        }
        runner.emit(CUSTOM_EVENTS.TASK, { task: 'message', arg: { name: `******** test:after:run=${test.title}` } });
    });
    (0, cypress_events_1.handleCyLogEvents)(runner, allureEventsEmitter, {
        ignoreCommands: () => { var _a; return ((_a = Cypress.env('allureSkipCommands')) !== null && _a !== void 0 ? _a : '').split(','); },
        allureLogCyCommands: () => Cypress.env('allureLogCyCommands') === undefined ||
            Cypress.env('allureLogCyCommands') === 'true' ||
            Cypress.env('allureLogCyCommands') === true,
        wrapCustomCommands: () => {
            if (Cypress.env('allureWrapCustomCommands') === undefined ||
                Cypress.env('allureWrapCustomCommands') === 'true' ||
                Cypress.env('allureWrapCustomCommands') === true) {
                return true;
            }
            if (Cypress.env('allureWrapCustomCommands') === 'false' || Cypress.env('allureWrapCustomCommands') === false) {
                return false;
            }
            return Cypress.env('allureWrapCustomCommands').split(',');
        },
    });
};
exports.registerMochaReporter = registerMochaReporter;
