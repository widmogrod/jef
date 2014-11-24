require('amdefine/intercept');

module.exports = {
    functional: require('./src/functional'),
    stream: require('./src/stream'),
    reactive: require('./src/reactive'),
    mathematical: require('./src/mathematical'),
    events: require('./src/events'),
    domdiff: require('./src/domdiff')
};
