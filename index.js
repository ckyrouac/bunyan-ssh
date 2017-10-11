'use strict';

const NodeSSH = require('node-ssh');
const ssh = new NodeSSH();

function BunyanSSH(options, error) {
    options = options || {};
    this.error = error || function () {};

    if (options.host) {
        this.host = options.host;
    }

    if (options.username) {
        this.username = options.username;
    }

    if (options.privateKey) {
        this.privateKey = options.privateKey;
    }

    if (options.log_path) {
        this.log_path = options.log_path;
    }

    if (options.stdout) {
        this.stdout = options.stdout;
    }

    return this._connect();
}

BunyanSSH.prototype._connect = function () {
    return ssh.connect({
        host: this.host,
        username: this.username,
        privateKey: this.privateKey
    });
};

BunyanSSH.prototype.sendLogRecord = function (record) {
    return ssh.execCommand(`echo -n '${record}' >> ${this.log_path}`);
};

BunyanSSH.prototype.write = function (record) {
    const self = this;

    if (this.stdout) {
        console.log(record);
    }

    return self._sendLogRecord().then(
    () => {},

    (error) => {
        console.log(error);
        return self._connect().then(() => self._sendLogRecord().then(
        () => {},

        (error) => {
            console.log('Couldnt send log over ssh!');
            console.log(error);
        }));
    });
};

module.exports = BunyanSSH;
