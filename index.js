const { ClientFunction } = require('testcafe');
const { red, green, reset } = require('chalk');

const runAxe = ClientFunction((context, options = {}) => {
    return new Promise((resolve) => {
        axe.run(context || document, options, (error, { violations }) => {
            resolve({ error, violations });
        });
    });
});

const createReport = violations => {
    if (!violations.length) {
        return green('0 violations found');
    }

    const report = violations.reduce((acc, { nodes, help }, i) => {
        acc += red(`${i + 1}) ${help}\n`);

        acc += reset(nodes.reduce((e, { target }) => {
            const targetNodes = target.map((t) => `"${t}"`).join(', ');
            e += `\t${targetNodes}\n`;
            return e;
        }, ''));

        return acc;

    }, red(`${violations.length} violations found:\n`));

    return reset(report);

};

const axeCheck = async (t, context, options) => {
    try {
        return await runAxe.with({ boundTestRun: t })(context, options);
    } catch (e) {
        return { error: e };
    }
};

const checkForViolations = async (t, context, options) => {
    const { violations = [] } = await axeCheck(t, context, options);

    await t.expect(violations.length === 0).ok(createReport(violations));
}

module.exports = {
    axeCheck,
    createReport,
    checkForViolations
};
