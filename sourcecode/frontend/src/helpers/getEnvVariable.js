export default (name, defaultValue = null) => {
    if (typeof window === 'undefined') {
        return process.env[name] || defaultValue;
    }

    return window.envVariables[name] || defaultValue;
};
