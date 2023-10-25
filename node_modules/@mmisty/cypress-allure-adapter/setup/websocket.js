"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessage = exports.startWsClient = void 0;
const common_1 = require("../common");
const helper_1 = require("./helper");
const dbg = 'cypress-allure:ws-client';
const PROCESS_INTERVAL_MS = 10;
const startWsClient = () => {
    const debug = (0, helper_1.logClient)(dbg);
    const port = Cypress.env(common_1.ENV_WS);
    if (!port) {
        console.log(`${common_1.packageLog} No existing ws server started. Will not report to allure. Set "allure" env variable to "true" to generate allure-results`);
        return undefined;
    }
    const wsPathFixed = `${port}/${common_1.wsPath}`.replace(/\/\//g, '/');
    const ws = new WebSocket(`ws://localhost:${wsPathFixed}`);
    ws.onopen = () => {
        ws.send('WS opened');
        debug(`${common_1.packageLog} Opened ws connection`);
    };
    return ws;
};
exports.startWsClient = startWsClient;
const messageQueue = new common_1.MessageQueue();
const createMessage = (ws) => {
    let idInterval;
    const process = () => {
        const debug = (0, helper_1.logClient)(dbg);
        if (ws.readyState !== ws.OPEN) {
            debug('ws connection is not opened yet');
            return;
        }
        const messages = messageQueue.dequeueAll();
        if (!messages || messages.length === 0) {
            return;
        }
        debug(`processing events ${messages.length}:`);
        messages.forEach(msg => {
            var _a, _b, _c, _d, _e, _f;
            debug(`${(_a = msg.data) === null || _a === void 0 ? void 0 : _a.task} : ${(_d = (_c = (_b = msg.data) === null || _b === void 0 ? void 0 : _b.arg) === null || _c === void 0 ? void 0 : _c.title) !== null && _d !== void 0 ? _d : (_f = (_e = msg.data) === null || _e === void 0 ? void 0 : _e.arg) === null || _f === void 0 ? void 0 : _f.name}`);
        });
        debug('---');
        messages.forEach(msg => {
            ws.send(JSON.stringify(msg));
        });
    };
    return {
        stop: () => {
            // process last events
            process();
            if (idInterval) {
                clearInterval(idInterval);
            }
        },
        process: () => {
            // process initial events
            process();
            idInterval = setInterval(process, PROCESS_INTERVAL_MS);
        },
        message: (data) => {
            messageQueue.enqueue(data); // todo add date time for every event
            ws.onclose = () => {
                if (idInterval) {
                    clearInterval(idInterval);
                }
            };
            ws.onerror = ev => {
                console.error(`${common_1.packageLog} Ws error ${ev}`);
            };
        },
    };
};
exports.createMessage = createMessage;
