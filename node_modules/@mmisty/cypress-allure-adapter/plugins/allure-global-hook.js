"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalHooks = void 0;
const debug_1 = __importDefault(require("debug"));
const allure_types_1 = require("./allure-types");
const log = (0, debug_1.default)('cypress-allure:reporter');
class GlobalHooks {
    constructor(reporter) {
        this.reporter = reporter;
        this.hooks = [];
    }
    hasHooks() {
        return this.hooks.length > 0;
    }
    get currentHook() {
        if (this.hooks.length === 0) {
            log('No current global hook!');
            return undefined;
        }
        return this.hooks[this.hooks.length - 1];
    }
    get currentStep() {
        if (!this.currentHook) {
            return undefined;
        }
        if (!this.currentHook.steps || this.currentHook.steps.length === 0) {
            log('Global hook: no current step');
            return undefined;
        }
        return this.currentHook.steps[this.currentHook.steps.length - 1];
    }
    start(title, id) {
        this.hooks.push({ title, hookId: id, start: Date.now() });
    }
    startStep(name) {
        if (!this.currentHook) {
            return;
        }
        if (!this.currentHook.steps) {
            this.currentHook.steps = [];
        }
        this.currentHook.steps.push({ name, event: 'start', date: Date.now() });
        log(`this.currentHook.steps: ${JSON.stringify(this.currentHook.steps.map(t => t.name))}`);
    }
    endStep(status, details) {
        if (!this.currentHook) {
            return;
        }
        if (!this.currentStep) {
            return;
        }
        if (!this.currentHook.steps) {
            this.currentHook.steps = [];
        }
        this.currentHook.steps.push({ name: '', event: 'stop', date: Date.now() });
        this.currentStep.status = status;
        this.currentStep.details = details;
        log(`this.currentHook.steps: ${JSON.stringify(this.currentHook.steps.map(t => t.name))}`);
    }
    end(status, details) {
        if (!this.currentHook) {
            return;
        }
        this.currentHook.stop = Date.now();
        this.currentHook.status = status;
        this.currentHook.details = details;
    }
    attachment(name, file, type) {
        log(`add attachement: ${name}`);
        if (!this.currentHook) {
            return;
        }
        if (!this.currentHook.attachments) {
            this.currentHook.attachments = [];
        }
        this.currentHook.attachments.push({ name, file, type });
        log(`added attachement: ${name}`);
    }
    // proces attachments
    processForTest() {
        log('process global hooks for test');
        const res = this.hooks;
        res.forEach(hook => {
            var _a;
            if (!hook.attachments || hook.attachments.length == 0) {
                log('no attachments');
            }
            (_a = hook.attachments) === null || _a === void 0 ? void 0 : _a.forEach(attach => {
                log('process attach');
                this.reporter.testFileAttachment({ name: attach.name, file: attach === null || attach === void 0 ? void 0 : attach.file, type: attach.type });
            });
        });
    }
    // when suite created
    process() {
        log('process global hooks');
        const res = this.hooks;
        this.hooks = [];
        log(res.map(t => t.title));
        res.forEach(hook => {
            var _a, _b, _c;
            this.reporter.hookStarted({
                title: hook.title,
                hookId: hook.hookId,
                date: hook.start,
            });
            log((_b = `hook steps: ${(_a = hook.steps) === null || _a === void 0 ? void 0 : _a.length}`) !== null && _b !== void 0 ? _b : 'undef');
            (_c = hook.steps) === null || _c === void 0 ? void 0 : _c.forEach(step => {
                var _a;
                if (step.event === 'start') {
                    this.reporter.startStep({ name: step.name, date: step.date });
                }
                if (step.event === 'stop') {
                    this.reporter.endStep({
                        status: (_a = step.status) !== null && _a !== void 0 ? _a : allure_types_1.UNKNOWN,
                        date: step.date,
                        details: step.details,
                    });
                }
            });
            this.reporter.endAllSteps({ status: hook.status || allure_types_1.UNKNOWN });
            this.reporter.hookEnded({
                title: hook.title,
                result: hook.status || allure_types_1.UNKNOWN,
                details: hook.details,
                date: hook.stop,
            });
        });
    }
}
exports.GlobalHooks = GlobalHooks;
