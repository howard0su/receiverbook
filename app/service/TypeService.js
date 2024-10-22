const OpenWebRxAdapter = require('./adapters/OpenWebRxAdapter');
const WebSdrAdapter = require('./adapters/WebSdrAdapter');
const KiwiSdrAdapter = require('./adapters/KiwiSdrAdapter');
const Web888Adapter = require('./adapters/Web888Adapter');

class TypeService {
    constructor() {
        this.types = {
            'openwebrx': {
                name: 'OpenWebRX',
                adapter: OpenWebRxAdapter
            },
            'websdr': {
                name: 'WebSDR',
                adapter: WebSdrAdapter
            },
            'kiwisdr': {
                name: 'KiwiSDR',
                adapter: KiwiSdrAdapter
            },
            'web888': {
                name: 'Web-888',
                adapter: Web888Adapter
            }
        }
    }
    getAdapter(type) {
        const adapterCls = this.types[type].adapter;
        return new adapterCls();
    }
    getAdapters() {
        return Object.fromEntries(
            Object.entries(this.types).map(([id, type]) => {
                return [id, type.adapter];
            })
        );
    }
    getName(type) {
        if (type in this.types) {
            return this.types[type].name;
        }
        return 'Other';
    }
    getNames() {
        return Object.fromEntries(
            Object.entries(this.types).map(([id, type]) => {
                return [id, type.name];
            })
        )
    }
}

module.exports = TypeService;