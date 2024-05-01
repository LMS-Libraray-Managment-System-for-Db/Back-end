"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDaysToDate = exports.getCurrentDate = void 0;
function getCurrentDate() {
    const currentDate = new Date();
    const options = { timeZone: 'Africa/Cairo' };
    return currentDate.toISOString().replace('Z', '') + 'Z';
}
exports.getCurrentDate = getCurrentDate;
// Utility function to add days to a given date and return in ISO-8601 format with Egypt timezone
function addDaysToDate(dateString, daysToAdd) {
    const currentDate = new Date(dateString);
    const targetDate = new Date(currentDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    const options = { timeZone: 'Africa/Cairo' };
    return targetDate.toISOString().replace('Z', '') + 'Z';
}
exports.addDaysToDate = addDaysToDate;
//# sourceMappingURL=dateHandeling.js.map