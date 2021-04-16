"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
var Command = /** @class */ (function () {
    function Command(name, aliases, execute, ownerOnly, dm) {
        if (ownerOnly === void 0) { ownerOnly = false; }
        if (dm === void 0) { dm = false; }
        this.name = name;
        this.aliases = aliases;
        this.execute = execute;
        this.ownerOnly = ownerOnly;
        this.dm = dm;
    }
    return Command;
}());
exports.Command = Command;
