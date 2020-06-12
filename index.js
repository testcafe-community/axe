const fs = require('fs');
const path = require('path');
const { ClientFunction } = require('testcafe');
const { red, green, reset } = require('chalk');
const {t} = require('testcafe');

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

        acc += red(`${i+1}) ${help}\n`);
        
        acc += reset(nodes.reduce((e, { target }) => {
            const targetNodes = target.map((t) => `"${t}"`).join(', ');
            e += `\t${targetNodes}\n`;
            return e;
        },''));

        return acc;

    }, red(`${violations.length} violations found:\n`));

    return reset(report);
    
};

const axeCheck = async (context, options) => {
    try {
        return await runAxe.with({ boundTestRun: t })(context, options);
    } catch (e) {
        return { error: e };
    }
};

const checkForViolations = ({numAllowed=0,context,options}) => {
    const {violations} = await axeCheck(context, options);

    await t.expect(violations.length <= numAllowed).ok(createReport(violations));

    return {violations};
}

module.exports = {
    axeCheck,
    createReport
};
