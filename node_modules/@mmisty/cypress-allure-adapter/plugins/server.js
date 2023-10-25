"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startReporterServer = void 0;
const ws_1 = require("ws");
const common_1 = require("../common");
const debug_1 = __importDefault(require("debug"));
const debug = (0, debug_1.default)('cypress-allure:server');
const logMessage = (0, debug_1.default)('cypress-allure:server:message');
const log = (...args) => {
    debug(`${args}`);
};
const messageGot = (...args) => {
    logMessage(`${args}`);
};
function getRandomPortNumber() {
    return 40000 + Math.round(Math.random() * 25000);
}
const socketLogic = (port, sockserver, tasks) => {
    if (!sockserver) {
        log('Could not start reporting server');
        return;
    }
    sockserver.on('connection', ws => {
        log('New client connected!');
        ws.send('connection established');
        ws.on('close', () => {
            log('Client has disconnected!');
        });
        ws.on('message', data => {
            messageGot('message received');
            messageGot(data);
            const parseData = (data) => {
                try {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return JSON.parse(data.toString());
                }
                catch (e) {
                    // console.log((e as Error).message);
                    return {};
                }
            };
            const requestData = parseData(data);
            const payload = requestData.data;
            if (requestData.id) {
                const result = executeTask(tasks, payload);
                sockserver.clients.forEach(client => {
                    log(`sending back: ${JSON.stringify(requestData)}`);
                    client.send(JSON.stringify({ payload, status: result ? 'done' : 'failed' }));
                });
            }
            else {
                sockserver.clients.forEach(client => {
                    log(`sending back: ${JSON.stringify(requestData)}`);
                    client.send(JSON.stringify({ payload, status: 'done' }));
                });
            }
        });
        ws.onerror = function () {
            console.log(`${common_1.packageLog} websocket error`);
        };
    });
};
const startReporterServer = (configOptions, tasks, attempt = 0) => {
    const wsPort = getRandomPortNumber();
    const sockserver = new ws_1.WebSocketServer({ port: wsPort, path: common_1.wsPath }, () => {
        configOptions.env[common_1.ENV_WS] = wsPort;
        const attemptMessage = attempt > 0 ? ` from ${attempt} attempt` : '';
        console.log(`${common_1.packageLog} running on ${wsPort} port${attemptMessage}`);
        socketLogic(wsPort, sockserver, tasks);
    });
    sockserver.on('error', err => {
        if (err.message.indexOf('address already in use') !== -1) {
            if (attempt < 30) {
                (0, exports.startReporterServer)(configOptions, tasks, attempt + 1);
            }
            else {
                console.error(`${common_1.packageLog} Could not find free port, will not report: ${err.message}`);
            }
            return;
        }
        console.error(`${common_1.packageLog} Error on ws server: ${err.message}`);
    });
};
exports.startReporterServer = startReporterServer;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const executeTask = (tasks, data) => {
    if (!data || !data.task) {
        log(`Will not run task - not data or task field:${JSON.stringify(data)}`);
        return false;
    }
    try {
        if (Object.keys(tasks).indexOf(data.task) !== -1) {
            const task = data.task; // todo check
            log(task);
            tasks[task](data.arg);
            return true;
        }
        else {
            log(`No such task: ${data.task}`);
        }
    }
    catch (err) {
        console.error(`${common_1.packageLog} Error running task: '${data.task}': ${err.message}`);
        console.log(err.stack);
    }
    return false;
};
