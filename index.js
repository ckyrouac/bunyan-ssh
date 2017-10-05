'use strict';

const NodeSSH = require('node-ssh');

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
}

BunyanSSH.prototype.write = function (record) {
    const self = this;

    if (this.stdout) {
        console.log(record);
    }

    const ssh = new NodeSSH();

    ssh.connect({
        host: self.host,
        username: self.username,
        privateKey: self.privateKey
    }).then(() => {
        return ssh.execCommand(`echo -n '${record}' >> ${self.log_path}`);
    }).catch((err) => {
        console.log(err);
    });
};

module.exports = BunyanSSH;
