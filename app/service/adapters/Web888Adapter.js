const OpenWebRXClassicAdapter = require('./OpenWebRXClassicAdapter');
const semver = require('semver');

class Web888Adapter extends OpenWebRXClassicAdapter {
    parseVersion(versionString) {
        const matches = /^Web888_v(.*)$/.exec(versionString)
        if (!matches) return false;
        try {
            return semver.coerce(matches[1]).toString();
        } catch (err) {
            console.error(err)
            return false;
        }
    }
    getType() {
        return "Web-888";
    }
}

module.exports = Web888Adapter;