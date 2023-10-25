"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allureAdapterSetup = void 0;
const debug_1 = __importDefault(require("debug"));
const commands_1 = require("../commands");
const allure_mocha_reporter_1 = require("./allure-mocha-reporter");
const websocket_1 = require("./websocket");
const common_1 = require("../common");
const debug = (0, debug_1.default)('cypress-allure:setup');
const allureAdapterSetup = () => {
    (0, commands_1.registerCommands)();
    const ws = (0, websocket_1.startWsClient)();
    if (!ws) {
        debug(`${common_1.packageLog} No reporting since server could not start`);
        (0, allure_mocha_reporter_1.registerStubReporter)();
        return;
    }
    (0, allure_mocha_reporter_1.registerMochaReporter)(ws);
};
exports.allureAdapterSetup = allureAdapterSetup;
