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
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseUrlFromUrl = exports.swapItems = exports.getContentType = exports.delay = exports.basename = exports.extname = exports.tmsIssueUrl = exports.MessageQueue = exports.packageLog = exports.ENV_WS = exports.wsPath = void 0;
exports.wsPath = '/__cypress/allure_messages/';
exports.ENV_WS = 'allureWsPort';
exports.packageLog = '[cypress-allure-adapter]';
class MessageQueue {
    constructor() {
        this.id = 0;
        this.messages = [];
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    enqueue(data) {
        this.id++;
        const message = { data, id: this.id };
        this.messages.push(message);
        this.messages.sort((a, b) => a.id - b.id);
    }
    dequeueAll() {
        return this.messages.splice(0, this.messages.length);
    }
}
exports.MessageQueue = MessageQueue;
const tmsIssueUrl = (env, value, type) => {
    if (value.startsWith('http://') || value.startsWith('https://')) {
        return value;
    }
    if (type === 'issue' && !env['issuePrefix']) {
        return value;
    }
    if (type === 'tms' && !env['tmsPrefix']) {
        return value;
    }
    const prefix = type === 'tms' ? env['tmsPrefix'] : env['issuePrefix'];
    if (prefix.indexOf('*') !== -1) {
        return prefix.replace('*', value);
    }
    const prefixFixed = prefix.endsWith('/') ? prefix.slice(0, prefix.length - 1) : prefix;
    return `${prefixFixed}/${value}`;
};
exports.tmsIssueUrl = tmsIssueUrl;
// needed to work in browser
const extname = (path) => {
    var _a, _b;
    return (_b = (_a = path.match(/(\.[^.\\/]+)$/)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : '.unknown';
};
exports.extname = extname;
// needed to work in browser
const basename = (path) => {
    const slashIndex = path.lastIndexOf('/');
    if (slashIndex > 0) {
        return path.slice(slashIndex + 1);
    }
    return path;
};
exports.basename = basename;
function delay(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise(resolve => setTimeout(resolve, ms));
    });
}
exports.delay = delay;
const getContentType = (file) => {
    const ext = (0, exports.extname)(file).toLowerCase();
    switch (ext) {
        case '.png': {
            return 'image/png';
        }
        case '.log':
        case '.txt': {
            return 'text/plain';
        }
        case '.json': {
            return 'application/json';
        }
        case '.htm':
        case '.html': {
            return 'text/html';
        }
        case '.csv': {
            return 'text/csv';
        }
        case '.xml': {
            return 'application/xml';
        }
        case '.jpeg':
        case '.jpg': {
            return 'image/jpeg';
        }
        case '.mp4': {
            return 'video/mp4';
        }
        case '.svg': {
            return 'image/svg+xml';
        }
        case '.zip':
        case '.pdf': {
            return 'application/zip';
        }
        case '.css': {
            return 'text/css';
        }
        default: {
            return 'application/zip';
        }
    }
};
exports.getContentType = getContentType;
const swapItems = (arr, index1, index2) => {
    if (index1 >= arr.length || index2 >= arr.length || index1 < 0 || index2 < 0) {
        return;
    }
    const temp = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
};
exports.swapItems = swapItems;
const baseUrlFromUrl = (url) => {
    const find = '://';
    const findPos = url.indexOf(find) + find.length;
    const indexUrl = url.slice(findPos).indexOf('/');
    return indexUrl === -1 ? `${url}/` : `${url.slice(0, indexUrl + findPos)}/`;
};
exports.baseUrlFromUrl = baseUrlFromUrl;
