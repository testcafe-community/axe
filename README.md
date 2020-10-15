# @testcafe-community/axe
The TestCafe module that allows you to use the [aXe](https://github.com/dequelabs/axe-core) accessibility engine in TestCafe tests.

## Installation

```bash
yarn add -D axe-core @testcafe-community/axe
```

Or using npm:

```bash
npm i -D axe-core @testcafe-community/axe
```

## How to use

You can write a TestCafe test with automated accessibility checks like this.

Add the following clientScript in your testcafe config:

```js
"clientScripts":[{"module":"axe-core/axe.min.js"}]
```

```js
import { checkForViolations } from '@testcafe-community/axe';

fixture `TestCafe tests with Axe`
    .page `http://example.com`;

test('Automated accessibility testing', async t => {
    // do stuff on your page
    await checkForViolations(t);
});
```

If any accessibility issues are found, you will see a detailed report in the error log.

![Accessibility errors](https://github.com/testcafe-community/axe/blob/master/errors.png)

## aXe options

The `@testcafe-community/axe` module allows you to define the `context` and `options` [axe.run parameters](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#api-name-axerun) in a TestCafe test.

```js
import { checkForViolations } from '@testcafe-community/axe';

test('Automated accessibility testing', async (t) => {
    const context = { exclude: [['select']] };
    const options = { rules: { 'html-has-lang': { enabled: false } } };

    await checkForViolations(t, context, options);
});
```

## Legacy API

This project was forked from [axe-testcafe](https://github.com/helen-dikareva/axe-testcafe) which has been dormant for quite some time.  If you prefer to use that API you can still use that:

```js
import { axeCheck, createReport } from 'axe-testcafe';

fixture `TestCafe tests with Axe`
    .page `http://example.com`;

test('Automated accessibility testing', async t => {
    const { error, violations } = await axeCheck(t);
    await t.expect(violations.length === 0).ok(createReport(violations));
});
```

## Using full axe result object and axe.configure

If you prefer to use a custom reporter for axe results you can get result object using runAxe function:

```js
import { runAxe } from '@testcafe-community/axe';
import { createHtmlReport } from 'axe-html-reporter'; // example of custom html report for axe results

fixture `TestCafe tests with Axe`
    .page `http://example.com`;

test('Automated accessibility testing', async t => {
    const { error, results } = await runAxe(); // "context" and "options" parameters are optional
    // "results" constant contains full axe Results object (https://www.deque.com/axe/core-documentation/api-documentation/#results-object)
    await t.expect(error).eql(null, `axe check failed with an error: ${error}`);
    createHtmlReport({
        violations: results.violations,
        passes: results.passes,
        incomplete: results.incomplete,
        url: results.url,
        projectKey: 'EXAMPLE',
    }); // creates HTML report with the default file name `accessibilityReport.html`
});
```
