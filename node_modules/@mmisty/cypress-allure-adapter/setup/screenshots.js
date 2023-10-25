"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerScreenshotHandler = void 0;
const helper_1 = require("./helper");
const common_1 = require("../common");
const deb = 'cypress-allure:screenshots';
const registerScreenshotHandler = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalHandler = Cypress.Screenshot.onAfterScreenshot;
    const debug = (0, helper_1.logClient)(deb);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Cypress.Screenshot.onAfterScreenshot = (_$el, ...args) => {
        debug('Screenshot handler');
        // testAttemptIndex, takenAt, name
        const [{ path }] = args;
        if (path) {
            // todo setting
            debug(`Attaching: ${path}`);
            Cypress.Allure.testFileAttachment((0, common_1.basename)(path), path, (0, common_1.getContentType)(path));
        }
        else {
            debug(`No path: ${JSON.stringify(args)}`);
        }
        originalHandler(_$el, ...args);
    };
};
exports.registerScreenshotHandler = registerScreenshotHandler;
