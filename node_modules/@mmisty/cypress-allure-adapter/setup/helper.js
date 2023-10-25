"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logClient = void 0;
const debug_1 = __importDefault(require("debug"));
const logClient = (namespace) => {
    const debug = (0, debug_1.default)(namespace);
    debug.enabled =
        Cypress.env('DEBUG') &&
            (Cypress.env('DEBUG').indexOf('*') !== -1
                ? namespace.startsWith(Cypress.env('DEBUG').replace('*', ''))
                : namespace === Cypress.env('DEBUG'));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (...args) => {
        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            debug(JSON.stringify(...args));
        }
        catch (err) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            debug(...args);
        }
    };
};
exports.logClient = logClient;
