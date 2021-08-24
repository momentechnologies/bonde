const log = console.log;
const info = console.info;

const events = [];

console.log = (...args) => {
    events.push({
        type: 'console.log',
        arguments: args,
    });
    log(...args);
};

console.info = (...args) => {
    events.push({
        type: 'console.log',
        arguments: args,
    });
    info(...args);
};
