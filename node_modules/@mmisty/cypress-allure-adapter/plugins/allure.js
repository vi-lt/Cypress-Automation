"use strict";
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
exports.allureTasks = void 0;
const debug_1 = __importDefault(require("debug"));
const allure_reporter_plugin_1 = require("./allure-reporter-plugin");
const allure_types_1 = require("./allure-types");
const fs_1 = require("fs");
const common_1 = require("../common");
const fast_glob_1 = __importDefault(require("fast-glob"));
const path_1 = require("path");
const debug = (0, debug_1.default)('cypress-allure:proxy');
const log = (...args) => {
    debug(args);
};
const copyResultsToWatchFolder = (allureResults, allureResultsWatch) => __awaiter(void 0, void 0, void 0, function* () {
    if (allureResults === allureResultsWatch) {
        log(`afterSpec allureResultsWatch the same as allureResults ${allureResults}, will not copy`);
        return;
    }
    const results = fast_glob_1.default.sync(`${allureResults}/*.*`);
    if (!(0, fs_1.existsSync)(allureResultsWatch)) {
        const mkdirSyncWithTry = (dir) => {
            for (let i = 0; i < 5; i++) {
                try {
                    (0, fs_1.mkdirSync)(dir);
                    return;
                }
                catch (err) {
                    // ignore
                }
            }
        };
        mkdirSyncWithTry(allureResultsWatch);
    }
    log(`allureResults: ${allureResults}`);
    log(`allureResultsWatch: ${allureResultsWatch}`);
    let doneFiles = 0;
    const started = Date.now();
    const timeout = 10000;
    results.forEach(res => {
        const to = `${allureResultsWatch}/${(0, path_1.basename)(res)}`;
        log(`copy file ${res} to ${to}`);
        (0, fs_1.copyFile)(res, to, err => {
            if (err) {
                log(err);
            }
            (0, fs_1.rm)(res, () => {
                // ignore
            });
            doneFiles = doneFiles + 1;
        });
    });
    while (doneFiles < results.length) {
        if (Date.now() - started >= timeout) {
            console.error(`${common_1.packageLog} Could not write all attachments in ${timeout}ms`);
            break;
        }
        yield (0, common_1.delay)(100);
    }
});
const allureTasks = (opts) => {
    // todo config
    let allureReporter = new allure_reporter_plugin_1.AllureReporter(opts);
    const allureResults = opts.allureResults;
    const allureResultsWatch = opts.techAllureResults;
    return {
        specStarted: (arg) => {
            log(`specStarted: ${JSON.stringify(arg)}`);
            // reset state on spec start
            allureReporter = new allure_reporter_plugin_1.AllureReporter(opts);
            allureReporter.specStarted(arg);
            log('specStarted');
        },
        hookStarted: (arg) => {
            log(`hookStart: ${JSON.stringify(arg)}`);
            allureReporter.hookStarted(arg);
            log('hookStarted');
        },
        hookEnded: (arg) => {
            log(`hookEnd: ${JSON.stringify(arg)}`);
            allureReporter.hookEnded(arg);
            log('hookEnded');
        },
        suiteStarted: (arg) => {
            log(`suiteStarted: ${JSON.stringify(arg)}`);
            allureReporter.suiteStarted(arg);
            log('suiteStarted');
        },
        stepStarted: (arg) => {
            log(`stepStarted ${JSON.stringify(arg)}`);
            allureReporter.startStep(arg);
            log('stepStarted');
        },
        step: (arg) => {
            var _a;
            log(`step ${JSON.stringify(arg)}`);
            allureReporter.startStep(arg);
            allureReporter.endStep(Object.assign(Object.assign({}, arg), { status: (_a = arg.status) !== null && _a !== void 0 ? _a : allure_types_1.Status.PASSED }));
            log('step');
        },
        mergeStepMaybe: (arg) => {
            var _a, _b;
            log(`mergePrevStep ${JSON.stringify(arg)}`);
            console.log('mergePrevStep');
            console.log(arg);
            const steps = (_b = (_a = allureReporter.currentTest) === null || _a === void 0 ? void 0 : _a.wrappedItem.steps) !== null && _b !== void 0 ? _b : [];
            const last = steps[(steps === null || steps === void 0 ? void 0 : steps.length) - 1];
            if (arg.name === last.name) {
                steps.splice((steps === null || steps === void 0 ? void 0 : steps.length) - 1, 1);
                allureReporter.startStep({ name: arg.name, date: last.start });
                last.steps.forEach(s => {
                    var _a;
                    (_a = allureReporter.currentStep) === null || _a === void 0 ? void 0 : _a.addStep(s);
                });
            }
            else {
                allureReporter.startStep({ name: arg.name, date: Date.now() });
            }
            log('mergePrevStep');
        },
        stepEnded: (arg) => {
            log(`stepEnded ${JSON.stringify(arg)}`);
            allureReporter.endStep(arg);
            log('stepEnded');
        },
        suiteEnded: (arg) => {
            log(`suiteEnded ${JSON.stringify(arg)}`);
            allureReporter.endGroup();
            log('suiteEnded');
        },
        /* globalHook: (arg: AllureTaskArgs<'globalHook'>) => {
          log(`globalHook ${JSON.stringify(arg)}`);
          allureReporter.addGlobalHooks();
          log('globalHook');
        },*/
        testStarted(arg) {
            log(`testStarted ${JSON.stringify(arg)}`);
            allureReporter.startTest(arg);
            log('testStarted');
        },
        writeEnvironmentInfo(arg) {
            allureReporter.allureRuntime.writer.writeEnvironmentInfo(arg.info);
        },
        writeExecutorInfo(arg) {
            try {
                (0, fs_1.writeFileSync)(`${allureResults}/executor.json`, JSON.stringify(arg.info));
            }
            catch (err) {
                console.error(`${common_1.packageLog} Could not write executor info`);
            }
        },
        writeCategoriesDefinitions(arg) {
            try {
                const getCategoriesContent = () => {
                    if (typeof arg.categories !== 'string') {
                        return JSON.stringify(arg.categories, null, '  ');
                    }
                    const file = arg.categories;
                    if (!(0, fs_1.existsSync)(file)) {
                        console.error(`${common_1.packageLog} Categories file doesn't exist '${file}'`);
                        return undefined;
                    }
                    return (0, fs_1.readFileSync)(file).toString();
                };
                const contents = getCategoriesContent();
                if (!contents) {
                    return;
                }
                (0, fs_1.writeFileSync)(`${allureResults}/categories.json`, contents);
            }
            catch (err) {
                console.error(`${common_1.packageLog} Could not write categories definitions info`);
            }
        },
        delete(arg) {
            try {
                if ((0, fs_1.existsSync)(arg.path)) {
                    (0, fs_1.rmSync)(arg.path, { recursive: true });
                }
            }
            catch (err) {
                log(`Could not delete: ${err.message}`);
            }
        },
        deleteResults(_arg) {
            allureReporter = new allure_reporter_plugin_1.AllureReporter(opts);
            try {
                if ((0, fs_1.existsSync)(allureResults)) {
                    (0, fs_1.rmSync)(allureResults, { recursive: true });
                }
            }
            catch (err) {
                log(`Could not delete: ${err.message}`);
            }
        },
        testResult(arg) {
            var _a;
            log(`testResult ${JSON.stringify(arg)}`);
            if (allureReporter.currentTest) {
                allureReporter.endAllSteps({ status: arg.result, details: arg.details });
                allureReporter.currentTest.status = arg.result;
                allureReporter.currentTest.detailsMessage = (_a = arg.details) === null || _a === void 0 ? void 0 : _a.message;
            }
            log('testResult');
        },
        testEnded: (arg) => __awaiter(void 0, void 0, void 0, function* () {
            log(`testEnded ${JSON.stringify(arg)}`);
            allureReporter.endTest(arg);
            log('testEnded');
        }),
        label: (arg) => {
            log(`label ${JSON.stringify(arg)}`);
            allureReporter.label(arg);
            log('label');
        },
        suite: (arg) => {
            log(`suite ${JSON.stringify(arg)}`);
            allureReporter.suite(arg);
            log('suite');
        },
        subSuite: (arg) => {
            log(`subSuite ${JSON.stringify(arg)}`);
            allureReporter.subSuite(arg);
            log('subSuite');
        },
        parentSuite: (arg) => {
            log(`parentSuite ${JSON.stringify(arg)}`);
            allureReporter.parentSuite(arg);
            log('parentSuite');
        },
        parameter: (arg) => {
            log(`parameter ${JSON.stringify(arg)}`);
            allureReporter.parameter(arg);
            log('parameter');
        },
        testStatus: (arg) => {
            log(`testStatus ${JSON.stringify(arg)}`);
            allureReporter.testStatus(arg);
            log('testStatus');
        },
        testDetails: (arg) => {
            log(`testDetails ${JSON.stringify(arg)}`);
            allureReporter.testDetails(arg);
            log('testDetails');
        },
        testAttachment: (arg) => {
            log(`testAttachment ${JSON.stringify(arg)}`);
            allureReporter.testAttachment(arg);
            log('testAttachment');
        },
        testFileAttachment: (arg) => {
            log(`testFileAttachment ${JSON.stringify(arg)}`);
            allureReporter.testFileAttachment(arg);
            log('testFileAttachment');
        },
        fileAttachment: (arg) => {
            log(`fileAttachment ${JSON.stringify(arg)}`);
            allureReporter.fileAttachment(arg);
            log('fileAttachment');
        },
        attachment: (arg) => {
            log(`attachment ${JSON.stringify(arg)}`);
            allureReporter.attachment(arg);
            log('attachment');
        },
        fullName: (arg) => {
            log(`fullName ${JSON.stringify(arg)}`);
            allureReporter.fullName(arg);
            log('fullName');
        },
        link: (arg) => {
            log(`link ${JSON.stringify(arg)}`);
            allureReporter.link(arg);
            log('link');
        },
        addDescriptionHtml: (arg) => {
            log(`addDescriptionHtml ${JSON.stringify(arg)}`);
            allureReporter.addDescriptionHtml(arg);
            log('addDescriptionHtml');
        },
        testParameter: (arg) => {
            log(`testParameter ${JSON.stringify(arg)}`);
            allureReporter.testParameter(arg);
            log('testParameter');
        },
        endAll: () => {
            log('endAll started');
            allureReporter.endAll();
            log('endAll');
        },
        message: (arg) => {
            log(`message ${JSON.stringify(arg)}`);
        },
        testMessage: (arg) => {
            log(`testMessage ${JSON.stringify(arg)}`);
            if (!opts.isTest) {
                return;
            }
            if (!(0, fs_1.existsSync)((0, path_1.dirname)(arg.path))) {
                (0, fs_1.mkdirSync)((0, path_1.dirname)(arg.path), { recursive: true });
                (0, fs_1.writeFileSync)(arg.path, '');
            }
            (0, fs_1.appendFileSync)(arg.path, `${arg.message}\n`);
        },
        screenshotOne: (arg) => {
            log(`screenshotOne ${JSON.stringify(arg)}`);
            allureReporter.screenshotOne(arg);
            log('screenshotOne');
        },
        // add all screenshots
        attachScreenshots: (arg) => {
            log(`attachScreenshots ${JSON.stringify(arg)}`);
            // this goes in after:spec
            allureReporter.attachScreenshots(arg);
            log('attachScreenshots');
        },
        /* attachVideoToTests: async (arg: AllureTaskArgs<'attachVideoToTests'>) => {
          log(`attachScreenshots ${JSON.stringify(arg)}`);
          await allureReporter.attachVideoToTests(arg);
          log('attachVideoToTests');
        },*/
        afterSpec(arg) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                log(`afterSpec ${JSON.stringify(arg)}`);
                if (arg.results && ((_a = arg.results) === null || _a === void 0 ? void 0 : _a.video)) {
                    const { video } = (_b = arg.results) !== null && _b !== void 0 ? _b : {};
                    log(`afterSpec video path: ${video}`);
                    yield allureReporter.attachVideoToTests({ path: video !== null && video !== void 0 ? video : '' });
                }
                else {
                    console.error(`${common_1.packageLog} No video path in afterSpec result`);
                }
                yield copyResultsToWatchFolder(allureResults, allureResultsWatch);
                log('afterSpec');
            });
        },
        /*flushWatcher: async (_arg: AllureTaskArgs<'flushWatcher'>) => {
          const allFiles = sync(`${allureResults}/*`);
          debug('FLUSH spec');
          let doneFiles = 0;
    
          for (const fl of allFiles) {
            if (!existsSync(fl)) {
              doneFiles = doneFiles + 1;
    
              return;
            }
    
            readFile(fl, (err, content) => {
              if (!err) {
                writeFile(fl, content, errWrite => {
                  if (errWrite) {
                    debug(`Error writing file: ${errWrite.message}`);
                  } else {
                    debug('done writing');
                    doneFiles++;
                  }
                });
              } else {
                debug(`Error reading file: ${err?.message}`);
              }
            });
          }
    
          const started = Date.now();
          const timeout = 10000;
    
          while (doneFiles < allFiles.length) {
            if (Date.now() - started >= timeout) {
              console.error(`Could not flush all files in ${timeout}ms`);
              break;
            }
            await delay(100);
          }
        },*/
    };
};
exports.allureTasks = allureTasks;
