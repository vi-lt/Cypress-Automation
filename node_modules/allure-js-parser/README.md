# allure-js-parser

The package allows you to parse allure-results raw files and convert them into a typed object.

With this object, you have the flexibility to perform various operations on the test results, such as generating a summary of tests, calculating statistics, or building a custom report.


## Installation
You can install `allure-js-parser` as a development dependency using npm:
```
npm i --save-dev allure-js-parser
```

## Usage
Provide the folder path where your allure-results files are stored (JSON files). 

For example:
```typescript
import { parseAllure } from 'allure-js-parser';

const tests = parseAllure('allure-results');
```

Once parsed, you can utilize the tests object to filter specific tests or generate 
statistics based on your requirements.

For instance, here's an example that filters all tests with the "regression" tag:
```typescript
const regressionTests = tests.filter(t => t.labels.some(t => t.name === 'tag' && t.value === 'regression'))
```

The tests object is strongly typed, making it easy to access any desired data from it.

You can extract information such as test names, statuses, labels, attachments, or any other relevant details.

Feel free to explore the tests object and leverage its rich data structure to suit your needs.

### Structure
Resulted object will look like:
```javascript
 [
      {
        attachments: [],
        fullName: 'fruits apples should wight ~100-400 gramms',
        historyId: 'c1586ad8-4dc1-5ba0-88c4-793f3636a961',
        labels: [
          {
            name: 'framework',
            value: 'JEST overridden',
          },
          {
            name: 'language',
            value: 'typescript/javascript',
          },
        ],
        links: [],
        name: 'should wight ~100-400 gramms',
        parameters: [],
        parent: {
          name: 'apples',
          uuid: '25d4c594-8978-4e65-9698-a83022ab4068',
          afters: [],
          befores: [],
          parent: {
            name: 'fruits',
            uuid: '3318fde9-9137-4f60-8111-5454f8c62262',
            afters: [],
            befores: [],
          },
        },
        stage: 'finished',
        start: 1685684498584,
        status: 'passed',
        statusDetails: {},
        steps: [
          {
            attachments: [],
            name: '2023-06-02 05:41:38.585 | NON_DEFAULT',
            parameters: [],
            stage: 'finished',
            start: 1685684498585,
            status: 'passed',
            statusDetails: {},
            steps: [],
            stop: 1685684498585,
          },
        ],
        stop: 1685684498586,
        uuid: '0843001b-832b-4621-a096-17a64642ef20',
      },
      {
        attachments: [],
        fullName: 'fruits apples should have stick',
        historyId: 'e66fdf04-03b5-5235-9e12-a14a415316f8',
        labels: [
          {
            name: 'tag',
            value: 'regression',
          },
          {
            name: 'framework',
            value: 'JEST overridden',
          },
          {
            name: 'language',
            value: 'typescript/javascript',
          },
        ],
        links: [],
        name: 'should have stick',
        parameters: [],
        parent: {
          name: 'apples',
          uuid: '25d4c594-8978-4e65-9698-a83022ab4068',
          afters: [],
          befores: [],
          parent: {
            name: 'fruits',
            uuid: '3318fde9-9137-4f60-8111-5454f8c62262',
            afters: [],
            befores: [],
          },
        },
        stage: 'finished',
        start: 1685684498567,
        status: 'passed',
        statusDetails: {},
        steps: [
          {
            attachments: [],
            name: '2023-06-02 05:41:38.568 | NON_DEFAULT',
            parameters: [],
            stage: 'finished',
            start: 1685684498568,
            status: 'passed',
            statusDetails: {},
            steps: [],
            stop: 1685684498569,
          },
        ],
        stop: 1685684498583,
        uuid: '523b0bed-891f-4f7a-91d2-c1f52af87b32',
      },
    ]
```
