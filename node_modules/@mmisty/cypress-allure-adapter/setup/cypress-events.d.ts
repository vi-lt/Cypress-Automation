/// <reference types="cypress" />
/// <reference types="cypress" />
import { EventEmitter } from 'events';
export declare const handleCyLogEvents: (runner: Mocha.Runner, events: EventEmitter, config: {
    wrapCustomCommands: () => boolean | string[];
    ignoreCommands: () => string[];
    allureLogCyCommands: () => boolean;
}) => void;
