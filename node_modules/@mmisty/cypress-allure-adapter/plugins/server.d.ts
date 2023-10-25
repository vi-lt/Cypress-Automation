/// <reference types="cypress" />
import PluginConfigOptions = Cypress.PluginConfigOptions;
import { AllureTasks } from '../plugins/allure-types';
export declare const startReporterServer: (configOptions: PluginConfigOptions, tasks: AllureTasks, attempt?: number) => void;
