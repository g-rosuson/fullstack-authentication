/**
 * Returns a promise that resolves after the given time,
 */
const sleep = (time = 250) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

const time = {
    sleep
};

export default time;