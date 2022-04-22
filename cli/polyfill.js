export default () => {
    Promise.timeOut = (ms = 1000) =>
        new Promise((r) => setTimeout(() => r(), ms));
}