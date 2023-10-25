/// <reference types="cypress" />
import PluginEvents = Cypress.PluginEvents;
import PluginConfigOptions = Cypress.PluginConfigOptions;
import type { AllureTasks } from './allure-types';
export declare const configureAllureAdapterPlugins: (on: PluginEvents, config: PluginConfigOptions) => AllureTasks | undefined;
