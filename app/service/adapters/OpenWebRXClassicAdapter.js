const ReceiverAdapter = require('./ReceiverAdapter');

class OpenWebRXClassicAdapter extends ReceiverAdapter {
    parseResponse(response) {
        return Object.fromEntries(response.split('\n').map((line) => {
            const items = line.split('=');
            return [items[0], items.slice(1).join(': ')];
        }));
    }
    parseCoordinates(gpsString) {
        const matches = /^\(([-0-9.]+), ([-0-9.]+)\)$/.exec(gpsString)
        if (!matches) return false;
        // longitude first!!
        return[parseFloat(matches[2]), parseFloat(matches[1])]
    }
    async matches(baseUrl, key) {
        const normalized = this.normalizeUrl(baseUrl);

        try {
            const statusUrl = new URL(normalized);
            statusUrl.pathname += 'status';
            const statusResponse = await this.axios().get(statusUrl.toString())
            const parsed = this.parseResponse(statusResponse.data);
            const version = this.parseVersion(parsed.sw_version);
            const location = this.parseCoordinates(parsed.gps);
            const bands = this.parseBands(parsed.bands);
            if (version) {
                return {
                    name: parsed.name,
                    email: parsed.op_email,
                    version,
                    location,
                    bands
                }
            }
        } catch (err) {
            console.error(`Error detecting ${this.getType()} receiver: `, err.stack);
        }

        return false;
    }
    parseBands(bandString) {
        const matches = /^([0-9]+)-([0-9]+)$/.exec(bandString)
        if (matches) {
            return {
                type: 'range',
                start_freq: matches[1],
                end_freq: matches[2]
            }
        }
        return []
    }
}

module.exports = OpenWebRXClassicAdapter;