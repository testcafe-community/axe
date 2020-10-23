const { ClientFunction } = require('testcafe');
const { red, green, reset } = require('chalk');

const runAxe = ClientFunction((context, options = {}) => {
    return new Promise((resolve) => {
        axe.run(context || document, options, (error, results) => {
            resolve({ error, results });
        });
    });
});

const configureAxe = ClientFunction((spec) => {
        return axe.configure(spec);
    }
);

const createReport = violations => {
    if (!violations.length) {
        return green('0 violations found');
    }

    const report = violations.reduce((acc, { nodes, help, helpUrl, tags, impact, id }, i) => {
        acc += red(`${i + 1}) ${help}\n`);
        acc += red(`* ${helpUrl}\n`);
        acc += red(`* ${tags.join(', ')}\n`);
        acc += red(`* ${impact}\n`);
        acc += red(`* ${id}\n`);

        acc += reset(nodes.reduce((e, { target }) => {
            const targetNodes = target.map((t) => `"${t}"`).join(', ');
            e += `\t${targetNodes}\n`;
            return e;
        }, ''));

        return acc;

    }, red(`${violations.length} violations found:\n`));

    return reset(report);

};

/**
 * Performs check with axe-core library.
 * Returns full results object that contains arrays of 'violations', 'passes', 'incomplete',
 * 'inapplicable' and additional values.
 * Axe results object: https://www.deque.com/axe/core-documentation/api-documentation/#results-object
 */
/**
 *
 * @param t
 * @param context
 * @param options
 * @returns {Promise<{error: *}|{error: *, results: {passes: *, violations: * }}>}
 */
const axeCheck = (t, context, options = { rules: {} }) => {
    try {
        // skipping the "document-title" rule as there is an issue with testcafe
        // being unable to find the title of a page inside the <head> tag.
        options = options["rules"]['document-title'] = {'enabled': false};
        return runAxe.with({ boundTestRun: t })(context, options);
    } catch (error) {
        return Promise.resolve({ error });
    }
};

const checkForViolations = async (t, context, options) => {
    const { error, results } = await axeCheck(t, context, options);

    await t.expect(error).notOk();
 
    await t.expect(results.violations.length === 0).ok(createReport(results.violations));
}


module.exports = {
    runAxe,
    configureAxe,
    axeCheck,
    createReport,
    checkForViolations
};
