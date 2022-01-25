"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynaTry = void 0;
var dyna_error_1 = require("dyna-error");
var dynaTry = function (_a) {
    var try_ = _a.try, timeout = _a.timeout, _b = _a.timeoutError, timeoutError = _b === void 0 ? (0, dyna_error_1.dynaError)({
        code: 600408,
        message: "Try timed out (".concat(timeout, "ms)"),
    }) : _b;
    return new Promise(function (resolve, reject) {
        var isResolved = false;
        var isRejected = false;
        var timer = setTimeout(function () {
            if (isResolved || isRejected)
                return;
            isRejected = true;
            try {
                reject(timeoutError);
            }
            catch (e) {
                reject(e);
            }
        }, timeout);
        try_()
            .then(function (d) {
            clearTimeout(timer);
            if (isRejected)
                return;
            isResolved = true;
            resolve(d);
        })
            .catch(function (e) {
            clearTimeout(timer);
            if (isRejected)
                return;
            isRejected = true;
            reject(e);
        });
    });
};
exports.dynaTry = dynaTry;
//# sourceMappingURL=dynaTry.js.map