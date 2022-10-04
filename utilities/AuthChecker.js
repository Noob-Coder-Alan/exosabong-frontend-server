"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authChecker = void 0;
// create auth checker function
const authChecker = ({ context: { currentUser } }, roles) => {
    // if `@Authorized()`, check only if user exists
    if (roles.length === 0) {
        return currentUser !== undefined;
    }
    // there are some roles defined now
    // and if no user, restrict access
    if (!currentUser) {
        return false;
    }
    // grant access if the roles overlap
    if (roles.includes(currentUser.role)) {
        return true;
    }
    // no roles matched, restrict access
    return false;
};
exports.authChecker = authChecker;
//# sourceMappingURL=AuthChecker.js.map