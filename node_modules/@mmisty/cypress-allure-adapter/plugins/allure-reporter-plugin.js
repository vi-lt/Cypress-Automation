"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllureReporter = void 0;
const allure_js_commons_1 = require("allure-js-commons");
const uuid_by_string_1 = __importDefault(require("uuid-by-string"));
const uuid_by_string_2 = __importDefault(require("uuid-by-string"));
const allure_js_parser_1 = require("allure-js-parser");
const fs_1 = require("fs");
const path_1 = __importStar(require("path"));
const fast_glob_1 = __importDefault(require("fast-glob"));
const debug_1 = __importDefault(require("debug"));
const allure_global_hook_1 = require("./allure-global-hook");
const allure_types_1 = require("./allure-types");
const common_1 = require("../common");
const crypto_1 = require("crypto");
const beforeEachHookName = '"before each" hook';
const beforeAllHookName = '"before all" hook';
const afterEachHookName = '"after each" hook';
const isBeforeEachHook = (ttl) => (ttl === null || ttl === void 0 ? void 0 : ttl.indexOf(beforeEachHookName)) !== -1;
const isAfterEachHook = (ttl) => (ttl === null || ttl === void 0 ? void 0 : ttl.indexOf(afterEachHookName)) !== -1;
const isBeforeAllHook = (ttl) => (ttl === null || ttl === void 0 ? void 0 : ttl.indexOf(beforeAllHookName)) !== -1;
const debug = (0, debug_1.default)('cypress-allure:reporter');
const log = (...args) => {
    debug(args);
};
const writeTestFile = (testFile, content, callBack) => {
    (0, fs_1.writeFile)(testFile, content, errWrite => {
        if (errWrite) {
            log(`error test file  ${errWrite.message} `);
            return;
        }
        log(`write test file done ${testFile} `);
        callBack();
    });
};
// all tests for session
const allTests = [];
class AllureReporter {
    constructor(opts) {
        var _a, _b;
        this.groups = [];
        this.tests = [];
        this.steps = [];
        this.labels = [];
        this.globalHooks = new allure_global_hook_1.GlobalHooks(this);
        // this is variable for global hooks only
        this.hooks = [];
        this.allHooks = [];
        this.descriptionHtml = [];
        this.attached = [];
        this.showDuplicateWarn = opts.showDuplicateWarn;
        this.allureResults = opts.allureResults;
        this.allureAddVideoOnPass = opts.allureAddVideoOnPass;
        this.videos = opts.videos;
        this.screenshots = opts.screenshots;
        this.allureSkipSteps =
            (_b = (_a = opts.allureSkipSteps) === null || _a === void 0 ? void 0 : _a.split(',').map(x => new RegExp(`^${x.replace(/\./g, '.').replace(/\*/g, '.*')}$`))) !== null && _b !== void 0 ? _b : [];
        log('Created reporter');
        log(opts);
        this.allureRuntime = new allure_js_commons_1.AllureRuntime({ resultsDir: this.allureResults });
    }
    get currentGroup() {
        if (this.groups.length === 0) {
            return undefined;
        }
        return this.groups[this.groups.length - 1];
    }
    get currentTest() {
        if (this.tests.length === 0) {
            log('No current test!');
            return undefined;
        }
        log('current test');
        return this.tests[this.tests.length - 1];
    }
    get currentHook() {
        if (this.hooks.length === 0) {
            return undefined;
        }
        log('current hook');
        return this.hooks[this.hooks.length - 1].hook;
    }
    get currentStep() {
        if (this.steps.length === 0) {
            return undefined;
        }
        log('current step');
        return this.steps[this.steps.length - 1];
    }
    get currentExecutable() {
        return this.currentStep || this.currentHook || this.currentTest;
    }
    addGlobalHooks() {
        log('>>> add Global Hooks');
        if (this.groups.length > 1 || !this.globalHooks.hasHooks()) {
            log('not root hooks');
            return;
        }
        log('add root hooks');
        this.globalHooks.process();
    }
    suiteStarted(arg) {
        var _a;
        const { title } = arg;
        log(`start group: ${title}`);
        const group = ((_a = this.currentGroup) !== null && _a !== void 0 ? _a : this.allureRuntime).startGroup(title);
        this.groups.push(group);
        log(`SUITES: ${JSON.stringify(this.groups.map(t => t.name))}`);
        if (this.groups.length === 1) {
            this.addGlobalHooks();
        }
    }
    specStarted(args) {
        log('SPEC started');
        log(JSON.stringify(args));
        this.currentSpec = args.spec;
        if (!(0, fs_1.existsSync)(this.allureResults)) {
            (0, fs_1.mkdirSync)(this.allureResults, { recursive: true });
        }
    }
    hookStarted(arg) {
        var _a, _b;
        const { title, hookId, date } = arg !== null && arg !== void 0 ? arg : {};
        if (!this.currentGroup) {
            log(`no current group - start added hook to storage: ${JSON.stringify(arg)}`);
            this.globalHooks.start(title, hookId);
            return;
        }
        if (!title) {
            return;
        }
        // when before each or after each we create just step inside current test
        if (this.currentTest && (isBeforeEachHook(title) || isAfterEachHook(title))) {
            log(`${title} will not be added to suite:${hookId} ${title}`);
            // need to end all steps before logging hook - it should be logged as parent
            this.endAllSteps({ status: allure_types_1.UNKNOWN });
            this.startStep({ name: title });
            return;
        }
        if (this.allureSkipSteps.every(t => !t.test(title))) {
            const currentHook = isBeforeAllHook(title) ? this.currentGroup.addBefore() : this.currentGroup.addAfter();
            currentHook.name = title;
            currentHook.wrappedItem.start = date !== null && date !== void 0 ? date : Date.now();
            this.hooks.push({ id: hookId, hook: currentHook });
            this.allHooks.push({ id: hookId, hook: currentHook, suite: (_a = this.currentGroup) === null || _a === void 0 ? void 0 : _a.uuid });
        }
        else {
            // create but not add to suite for steps to be added there
            const currentHook = new allure_js_commons_1.ExecutableItemWrapper({
                name: title,
                uuid: '',
                historyId: '',
                links: [],
                attachments: [],
                parameters: [],
                labels: [],
                steps: [],
                statusDetails: { message: '', trace: '' },
                stage: allure_types_1.Stage.FINISHED,
            });
            currentHook.wrappedItem.start = date !== null && date !== void 0 ? date : Date.now();
            this.hooks.push({ id: hookId, hook: currentHook });
            this.allHooks.push({ id: hookId, hook: currentHook, suite: (_b = this.currentGroup) === null || _b === void 0 ? void 0 : _b.uuid });
        }
    }
    setExecutableStatus(executable, res, dtls) {
        if (!executable) {
            return;
        }
        if (res === allure_types_1.Status.PASSED) {
            executable.status = allure_types_1.Status.PASSED;
            executable.stage = allure_types_1.Stage.FINISHED;
        }
        if (res === allure_types_1.Status.BROKEN) {
            executable.status = allure_types_1.Status.BROKEN;
            executable.stage = allure_types_1.Stage.FINISHED;
        }
        if (res === allure_types_1.Status.FAILED) {
            executable.status = allure_types_1.Status.FAILED;
            executable.stage = allure_types_1.Stage.FINISHED;
            executable.detailsMessage = dtls === null || dtls === void 0 ? void 0 : dtls.message;
            executable.detailsTrace = dtls === null || dtls === void 0 ? void 0 : dtls.trace;
        }
        if (res === allure_types_1.Status.SKIPPED) {
            executable.status = allure_types_1.Status.SKIPPED;
            executable.stage = allure_types_1.Stage.PENDING;
            executable.detailsMessage = (dtls === null || dtls === void 0 ? void 0 : dtls.message) || 'Suite disabled';
        }
        if (res !== allure_types_1.Status.FAILED && res !== allure_types_1.Status.BROKEN && res !== allure_types_1.Status.PASSED && res !== allure_types_1.Status.SKIPPED) {
            executable.status = allure_types_1.UNKNOWN;
            executable.stage = allure_types_1.Stage.PENDING;
            executable.detailsMessage = (dtls === null || dtls === void 0 ? void 0 : dtls.message) || `Result: ${res !== null && res !== void 0 ? res : '<no>'}`;
        }
        if (dtls) {
            executable.statusDetails = dtls;
        }
    }
    setExecutableItemStatus(executableItem, res, dtls) {
        if (!executableItem) {
            return;
        }
        executableItem.status = res;
        if (res === allure_types_1.Status.FAILED) {
            if (dtls) {
                executableItem.statusDetails.message = dtls === null || dtls === void 0 ? void 0 : dtls.message;
                executableItem.statusDetails.trace = dtls === null || dtls === void 0 ? void 0 : dtls.trace;
            }
        }
        if (res === allure_types_1.Status.SKIPPED) {
            executableItem.statusDetails.message = dtls === null || dtls === void 0 ? void 0 : dtls.message;
        }
        if (res !== allure_types_1.Status.FAILED && res !== allure_types_1.Status.BROKEN && res !== allure_types_1.Status.PASSED && res !== allure_types_1.Status.SKIPPED) {
            executableItem.statusDetails.message = dtls === null || dtls === void 0 ? void 0 : dtls.message;
        }
    }
    hookEnded(arg) {
        var _a;
        const { title, date, result, details } = arg !== null && arg !== void 0 ? arg : {};
        if (!this.currentGroup) {
            log('no current group - will end hook in storage');
            this.globalHooks.end(result, details);
            return;
        }
        if (isBeforeEachHook(title) || isAfterEachHook(title)) {
            this.endStep({ status: ((_a = this.currentStep) === null || _a === void 0 ? void 0 : _a.isAnyStepFailed) ? allure_types_1.Status.FAILED : allure_types_1.Status.PASSED });
            this.endAllSteps({ status: allure_types_1.UNKNOWN });
            return;
        }
        if (this.currentHook) {
            this.filterSteps(this.currentHook.wrappedItem);
            this.currentHook.wrappedItem.stop = date !== null && date !== void 0 ? date : Date.now();
            this.setExecutableStatus(this.currentHook, result, details);
            this.hooks.pop();
            return;
        }
    }
    endHooks(status = allure_types_1.Status.PASSED) {
        this.hooks.forEach(h => {
            this.hookEnded({ title: h.hook.name, result: status });
        });
    }
    attachScreenshots(arg) {
        const { screenshots } = arg;
        log('attachScreenshots:');
        screenshots === null || screenshots === void 0 ? void 0 : screenshots.forEach(x => {
            const screenshotContent = (0, fs_1.readFileSync)(x.path);
            const guidScreenshot = (0, uuid_by_string_2.default)(screenshotContent.toString());
            if (this.attached.filter(t => t.indexOf(guidScreenshot) !== -1).length > 0) {
                log(`Already attached: ${x.path}`);
                return;
            }
            log(`attachScreenshots:${x.path}`);
            const uuids = allTests.filter(t => t.mochaId == x.testId).map(t => t.uuid);
            uuids.forEach(uuid => {
                const testFile = `${this.allureResults}/${uuid}-result.json`;
                const contents = (0, fs_1.readFileSync)(testFile);
                const ext = path_1.default.extname(x.path);
                const name = path_1.default.basename(x.path);
                const testCon = JSON.parse(contents.toString());
                const uuidNew = (0, crypto_1.randomUUID)();
                const nameAttAhc = `${uuidNew}-attachment${ext}`; // todo not copy same image
                const newPath = path_1.default.join(this.allureResults, nameAttAhc);
                if (!(0, fs_1.existsSync)(newPath)) {
                    (0, fs_1.copyFileSync)(x.path, path_1.default.join(this.allureResults, nameAttAhc));
                }
                if (!testCon.attachments) {
                    testCon.attachments = [];
                }
                testCon.attachments.push({
                    name: name,
                    type: 'image/png',
                    source: nameAttAhc, // todo
                });
                (0, fs_1.writeFileSync)(testFile, JSON.stringify(testCon));
            });
        });
    }
    screenshotOne(arg) {
        const { name, forStep } = arg;
        const pattern = `${this.screenshots}/**/${name}*.png`;
        const files = fast_glob_1.default.sync(pattern);
        if (files.length === 0) {
            log(`NO SCREENSHOTS: ${pattern}`);
            return;
        }
        files.forEach(file => {
            var _a;
            const executable = (_a = this.currentStep) !== null && _a !== void 0 ? _a : this.currentTest;
            const attachTo = forStep ? executable : this.currentTest;
            // to have it in allure-results directory
            const newUuid = (0, crypto_1.randomUUID)();
            const fileNew = `${newUuid}-attachment.png`;
            if (!(0, fs_1.existsSync)(this.allureResults)) {
                (0, fs_1.mkdirSync)(this.allureResults, { recursive: true });
            }
            if (!(0, fs_1.existsSync)(file)) {
                console.log(`file ${file} doesnt exist`);
                return;
            }
            (0, fs_1.copyFileSync)(file, `${this.allureResults}/${fileNew}`);
            attachTo === null || attachTo === void 0 ? void 0 : attachTo.addAttachment((0, path_1.basename)(file), { contentType: 'image/png', fileExtension: 'png' }, fileNew);
            this.attached.push(fileNew);
        });
    }
    attachVideoToTests(arg) {
        return __awaiter(this, void 0, void 0, function* () {
            // this happens after test has already finished
            const { path: videoPath } = arg;
            log(`attachVideoToTests: ${videoPath}`);
            const ext = '.mp4';
            const specname = (0, path_1.basename)(videoPath, ext);
            log(specname);
            const res = (0, allure_js_parser_1.parseAllure)(this.allureResults);
            const tests = res
                .filter(t => (this.allureAddVideoOnPass ? true : t.status !== 'passed' && t.status !== 'skipped'))
                .map(t => {
                var _a;
                return ({
                    path: (_a = t.labels.find(l => l.name === 'path')) === null || _a === void 0 ? void 0 : _a.value,
                    id: t.uuid,
                    fullName: t.fullName,
                });
            });
            const testsAttach = tests.filter(t => t.path && t.path.indexOf(specname) !== -1);
            let doneFiles = 0;
            (0, fs_1.readFile)(videoPath, (errVideo, _contentVideo) => {
                if (errVideo) {
                    console.error(`Could not read video: ${errVideo}`);
                    return;
                }
                testsAttach.forEach(test => {
                    log(`ATTACHING to ${test.id} ${test.path} ${test.fullName}`);
                    const testFile = `${this.allureResults}/${test.id}-result.json`;
                    (0, fs_1.readFile)(testFile, (err, contents) => {
                        if (err) {
                            return;
                        }
                        const testCon = JSON.parse(contents.toString());
                        const uuid = (0, crypto_1.randomUUID)();
                        // todo do not copy same video
                        // currently Allure Testops does not rewrite uploaded results if use same file
                        // const uuid = getUuidByString(contentVideo.toString());
                        const nameAttAhc = `${uuid}-attachment${ext}`;
                        const newPath = path_1.default.join(this.allureResults, nameAttAhc);
                        if (!testCon.attachments) {
                            testCon.attachments = [];
                        }
                        testCon.attachments.push({
                            name: `${specname}${ext}`,
                            type: 'video/mp4',
                            source: nameAttAhc,
                        });
                        if ((0, fs_1.existsSync)(newPath)) {
                            log(`not writing! video file ${newPath} `);
                            writeTestFile(testFile, JSON.stringify(testCon), () => {
                                doneFiles = doneFiles + 1;
                            });
                            return;
                        }
                        log(`write video file ${newPath} `);
                        (0, fs_1.copyFile)(videoPath, newPath, errCopy => {
                            if (errCopy) {
                                log(`error copy file  ${errCopy.message} `);
                                return;
                            }
                            log(`write test file ${testFile} `);
                            writeTestFile(testFile, JSON.stringify(testCon), () => {
                                doneFiles = doneFiles + 1;
                            });
                        });
                    });
                });
            });
            const started = Date.now();
            const timeout = 10000;
            while (doneFiles < testsAttach.length) {
                if (Date.now() - started >= timeout) {
                    console.error(`Could not write all video attachments in ${timeout}ms`);
                    break;
                }
                yield (0, common_1.delay)(100);
            }
        });
    }
    endGroup() {
        var _a;
        // why >= 1?
        if (this.groups.length >= 1) {
            this.addGlobalHooks();
        }
        if (this.currentGroup) {
            (_a = this.currentGroup) === null || _a === void 0 ? void 0 : _a.endGroup();
            this.groups.pop();
        }
    }
    endAllGroups() {
        this.groups.forEach(g => {
            g.endGroup();
        });
        this.attached = [];
        this.allHooks = [];
    }
    label(arg) {
        if (this.currentTest) {
            this.currentTest.addLabel(arg.name, arg.value);
        }
    }
    link(arg) {
        if (this.currentTest) {
            this.currentTest.addLink(arg.url, arg.name, arg.type);
        }
    }
    fullName(arg) {
        if (this.currentTest) {
            this.currentTest.fullName = arg.value;
        }
    }
    parameter(arg) {
        if (this.currentExecutable) {
            this.currentExecutable.addParameter(arg.name, arg.value);
        }
    }
    addGroupLabelByUser(label, value) {
        if (value === undefined) {
            // remove suite labels
            this.labels = this.labels.filter(t => t.name !== label);
        }
        else {
            this.labels.push({ name: label, value: value });
        }
    }
    suite(arg) {
        if (!this.currentTest) {
            return;
        }
        this.addGroupLabelByUser(allure_types_1.LabelName.SUITE, arg.name);
    }
    parentSuite(arg) {
        if (!this.currentTest) {
            return;
        }
        this.addGroupLabelByUser(allure_types_1.LabelName.PARENT_SUITE, arg.name);
    }
    subSuite(arg) {
        if (!this.currentTest) {
            return;
        }
        this.addGroupLabelByUser(allure_types_1.LabelName.SUB_SUITE, arg.name);
    }
    testParameter(arg) {
        if (this.currentTest) {
            this.currentTest.addParameter(arg.name, arg.value);
        }
    }
    testFileAttachment(arg) {
        this.executableFileAttachment(this.currentTest, arg);
    }
    fileAttachment(arg) {
        this.executableFileAttachment(this.currentExecutable, arg);
    }
    testAttachment(arg) {
        this.executableAttachment(this.currentTest, arg);
    }
    attachment(arg) {
        this.executableAttachment(this.currentExecutable, arg);
    }
    addGroupLabels() {
        var _a, _b;
        const [parentSuite, suite, subSuite] = this.groups;
        if (this.currentSpec) {
            const paths = (_a = this.currentSpec.relative) === null || _a === void 0 ? void 0 : _a.split('/');
            (_b = this.currentTest) === null || _b === void 0 ? void 0 : _b.addLabel(allure_types_1.LabelName.PACKAGE, paths.join('.'));
        }
        if (this.groups.length > 0) {
            this.labels.push({ name: allure_types_1.LabelName.PARENT_SUITE, value: parentSuite.name });
        }
        if (this.groups.length > 1) {
            this.labels.push({ name: allure_types_1.LabelName.SUITE, value: suite.name });
        }
        if (this.groups.length > 2) {
            this.labels.push({ name: allure_types_1.LabelName.SUB_SUITE, value: subSuite.name });
        }
    }
    startTest(arg) {
        var _a, _b, _c;
        const { title, fullTitle, id, currentRetry } = arg;
        if (this.currentTest) {
            // temp fix of defect with wrong event sequence
            log(`will not start already started test: ${fullTitle}`);
            return;
        }
        const duplicates = allTests.filter(t => t.fullTitle === fullTitle);
        const warn = 'Starting test with the same fullName as already exist, will be shown as ' +
            `retried: ${fullTitle}\nTo solve this rename the test. Spec ${(_a = this.currentSpec) === null || _a === void 0 ? void 0 : _a.relative}, ` +
            `test full title:  ${fullTitle}`;
        if (duplicates.length > 0 && currentRetry === 0 && this.showDuplicateWarn) {
            console.warn(`${common_1.packageLog} ${warn}`);
        }
        if (!this.currentGroup) {
            // fallback
            this.suiteStarted({ title: 'Root suite', fullTitle: 'Root suite' });
        }
        const group = this.currentGroup;
        const test = group.startTest(title);
        allTests.push({ specRelative: (_b = this.currentSpec) === null || _b === void 0 ? void 0 : _b.relative, fullTitle, mochaId: id, uuid: test.uuid }); // to show warning
        this.tests.push(test);
        test.fullName = fullTitle;
        test.historyId = (0, uuid_by_string_1.default)(fullTitle);
        this.addGroupLabels();
        if ((_c = this.currentSpec) === null || _c === void 0 ? void 0 : _c.relative) {
            test.addLabel('path', this.currentSpec.relative);
        }
        this.globalHooks.processForTest();
    }
    endTests() {
        this.tests.forEach(() => {
            this.endTest({ result: allure_types_1.UNKNOWN, details: undefined });
        });
    }
    endGroups() {
        this.endTests();
        this.groups.forEach(() => {
            this.endGroup();
        });
    }
    endAll() {
        this.endAllSteps({ status: allure_types_1.UNKNOWN, details: undefined });
        this.endHooks(allure_types_1.Status.BROKEN);
        this.endGroups();
    }
    addDescriptionHtml(arg) {
        this.descriptionHtml.push(arg.value);
        this.applyDescriptionHtml();
    }
    applyDescriptionHtml() {
        if (this.currentTest) {
            this.currentTest.descriptionHtml = this.descriptionHtml.join('');
        }
    }
    testStatus(arg) {
        if (!this.currentTest) {
            return;
        }
        this.testStatusStored = arg;
    }
    testDetails(arg) {
        if (!this.currentTest) {
            return;
        }
        this.testDetailsStored = arg;
    }
    applyGroupLabels() {
        // apply labels
        const applyLabel = (name) => {
            if (!this.currentTest) {
                return;
            }
            const lb = this.labels.filter(l => l.name == name);
            // return last added
            const lastLabel = lb[lb.length - 1];
            if (lastLabel) {
                this.currentTest.addLabel(lastLabel.name, lastLabel.value);
            }
        };
        applyLabel(allure_types_1.LabelName.PARENT_SUITE);
        applyLabel(allure_types_1.LabelName.SUITE);
        applyLabel(allure_types_1.LabelName.SUB_SUITE);
    }
    filterSteps(result) {
        const skipSteps = this.allureSkipSteps;
        if (result && result.steps.length > 0) {
            result.steps = result.steps.filter(t => !skipSteps.some(x => { var _a; return x.test((_a = t.name) !== null && _a !== void 0 ? _a : ''); }));
            result.steps.forEach(res => {
                this.filterSteps(res);
            });
        }
    }
    endTest(arg) {
        const { result, details } = arg;
        const storedStatus = this.testStatusStored;
        const storedDetails = this.testDetailsStored;
        /*
          todo case when all steps finished but test failed
          if (this.steps.length === 0) {
           */
        // all ended already
        /*this.currentExecutable?.wrappedItem.steps && this.currentExecutable.wrappedItem.steps.length > 0) {
            this.startStep({ name: 'some of previous steps failed' });
            this.endStep({ status: arg.result, details: arg.details });
          }
          }
        */
        this.endAllSteps({ status: result, details });
        if (!this.currentTest) {
            return;
        }
        // filter steps here
        this.filterSteps(this.currentTest.wrappedItem);
        this.setExecutableStatus(this.currentTest, result, details);
        if (storedDetails) {
            this.setExecutableStatus(this.currentTest, result, storedDetails.details);
        }
        if (storedStatus) {
            this.setExecutableStatus(this.currentTest, storedStatus.result, storedStatus.details);
        }
        this.applyGroupLabels();
        const uid = this.currentTest.uuid;
        this.currentTest.endTest();
        this.tests.pop();
        this.descriptionHtml = [];
        this.testStatusStored = undefined;
        this.testDetailsStored = undefined;
        this.labels = [];
        const waitResultWritten = (results, file) => {
            const started = Date.now();
            while (!(Date.now() - started > 10000 || (0, fs_1.existsSync)(file))) {
                // do sync
            }
            if (!(0, fs_1.existsSync)(file)) {
                console.error(`${common_1.packageLog} Result file doesn't exist: ${file}`);
            }
        };
        waitResultWritten(this.allureResults, `${this.allureResults}/${uid}-result.json`);
    }
    startStep(arg) {
        const { name, date } = arg;
        if (!this.currentExecutable || this.globalHooks.currentHook) {
            log('will start step for global hook');
            this.globalHooks.startStep(name);
            return;
        }
        log('start step for current executable');
        const step = this.currentExecutable.startStep(name, date);
        this.steps.push(step);
    }
    endAllSteps(arg) {
        while (this.steps.length !== 0) {
            this.endStep(arg);
        }
    }
    // set status to last step recursively
    setLastStepStatus(steps, status, details) {
        const stepsCount = steps.length;
        if (stepsCount > 0) {
            this.setLastStepStatus(steps[stepsCount - 1].steps, status, details);
            this.setExecutableItemStatus(steps[stepsCount - 1], status, details);
        }
    }
    endStep(arg) {
        const { status, date, details } = arg;
        if (!this.currentExecutable) {
            log('No current executable, test or hook - will end step for global hook');
            this.globalHooks.endStep(arg.status, details);
            return;
        }
        if (!this.currentStep) {
            this.setLastStepStatus(this.currentExecutable.wrappedItem.steps, status, details);
            return;
        }
        this.setLastStepStatus(this.currentStep.wrappedItem.steps, status, details);
        this.setExecutableStatus(this.currentStep, status, details);
        this.currentStep.endStep(date);
        this.steps.pop();
    }
    executableAttachment(exec, arg) {
        if (!exec) {
            log('No current executable - will not attach');
            return;
        }
        const file = this.allureRuntime.writeAttachment(arg.content, arg.type);
        exec.addAttachment(arg.name, arg.type, file);
    }
    executableFileAttachment(exec, arg) {
        if (!this.currentExecutable && this.globalHooks.currentHook) {
            log('No current executable, test or hook - add to global hook');
            this.globalHooks.attachment(arg.name, arg.file, arg.type);
            return;
        }
        if (!exec) {
            return;
        }
        if (!(0, fs_1.existsSync)(arg.file)) {
            console.log(`${common_1.packageLog} Attaching file: file ${arg.file} doesnt exist`);
            return;
        }
        try {
            const uuid = (0, crypto_1.randomUUID)();
            // to have it in allure-results directory
            const fileNew = `${uuid}-attachment${(0, common_1.extname)(arg.file)}`;
            if (!(0, fs_1.existsSync)(this.allureResults)) {
                (0, fs_1.mkdirSync)(this.allureResults, { recursive: true });
            }
            (0, fs_1.copyFileSync)(arg.file, `${this.allureResults}/${fileNew}`);
            exec.addAttachment(arg.name, arg.type, fileNew);
        }
        catch (err) {
            console.error(`${common_1.packageLog} Could not attach ${arg.file}`);
        }
    }
}
exports.AllureReporter = AllureReporter;
