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
exports.configureAllureAdapterPlugins = void 0;
const debug_1 = __importDefault(require("debug"));
const allure_1 = require("./allure");
const server_1 = require("./server");
const fs_1 = require("fs");
const debug = (0, debug_1.default)('cypress-allure:plugins');
// this runs in node
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const configureAllureAdapterPlugins = (on, config) => {
    var _a, _b;
    if (process.env.DEBUG) {
        config.env['DEBUG'] = process.env.DEBUG;
    }
    if (config.env['GREP_PRE_FILTER'] === 'true' || config.env['GREP_PRE_FILTER'] === true) {
        debug('Not running allure in prefiltering mode');
        return undefined;
    }
    if (config.env['allure'] !== 'true' && config.env['allure'] !== true) {
        debug('Not running allure. Set "allure" env variable to "true" to generate allure-results');
        return undefined;
    }
    debug('Register plugin');
    const results = (_a = config.env['allureResults']) !== null && _a !== void 0 ? _a : 'allure-results';
    const watchResultsPath = config.env['allureResultsWatchPath'];
    const allureAddVideoOnPass = config.env['allureAddVideoOnPass'] === true || config.env['allureAddVideoOnPass'] === 'true';
    const showDuplicateWarn = config.env['allureShowDuplicateWarn']
        ? config.env['allureShowDuplicateWarn'] === true || config.env['allureShowDuplicateWarn'] === 'true'
        : false;
    const options = {
        showDuplicateWarn,
        allureAddVideoOnPass,
        allureResults: results,
        techAllureResults: watchResultsPath !== null && watchResultsPath !== void 0 ? watchResultsPath : results,
        allureSkipSteps: (_b = config.env['allureSkipSteps']) !== null && _b !== void 0 ? _b : '',
        screenshots: config.screenshotsFolder || 'no',
        videos: config.videosFolder,
        isTest: config.env['JEST_TEST'] === 'true' || config.env['JEST_TEST'] === true,
    };
    debug('OPTIONS:');
    debug(JSON.stringify(options, null, ' '));
    if (config.env['allureCleanResults'] === 'true' || config.env['allureCleanResults'] === true) {
        debug('Clean results');
        const cleanDir = (dir) => {
            if (!(0, fs_1.existsSync)(dir)) {
                return;
            }
            debug(`Deleting ${dir}`);
            try {
                (0, fs_1.rmSync)(dir, { recursive: true });
            }
            catch (err) {
                debug(`Error deleting ${dir}: ${err.message}`);
            }
        };
        cleanDir(options.allureResults);
        cleanDir(options.techAllureResults);
        try {
            (0, fs_1.mkdirSync)(options.allureResults, { recursive: true });
            (0, fs_1.mkdirSync)(options.techAllureResults, { recursive: true });
        }
        catch (err) {
            debug(`Error creating allure-results: ${err.message}`);
        }
    }
    const reporter = (0, allure_1.allureTasks)(options);
    debug('Registered with options:');
    debug(options);
    (0, server_1.startReporterServer)(config, reporter);
    // todo cleanup
    config.reporterOptions = Object.assign(Object.assign({}, config.reporterOptions), { url: config.reporterUrl });
    // process.on('message', (message: any) => {
    //   const [event, , args] = message.args;
    //   /*console.log('message');
    //   console.log(message);
    //   console.log(message.args);*/
    //
    //   if (message.event !== 'preprocessor:close') {
    //     return;
    //   }
    //   console.log(message);
    //   const [spec] = message.args;
    //   console.log(spec);
    //   //const [spec, results] = args;
    //   reporter.suiteStarted({ fullTitle: 'd', title: 'video' });
    //   reporter.testStarted({ fullTitle: spec, title: spec, id: spec });
    //   reporter.video({ path: 'd' });
    //   reporter.testEnded({ result: 'passed' });
    //   reporter.suiteEnded({});
    // });
    on('after:spec', (spec, results) => __awaiter(void 0, void 0, void 0, function* () {
        yield reporter.afterSpec({ results });
    }));
    return reporter;
};
exports.configureAllureAdapterPlugins = configureAllureAdapterPlugins;
