"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateUtils = void 0;
class DateUtils {
    /**
     * Convert a time string ('1h25s', '6th') in millis
     * @param arg time in string ('1h25s', '6th')
     * @returns time in millis to arg
     */
    static parseTime(arg) {
        var days = 0, hours = 0, minutes = 0, seconds = 0;
        var match = arg.match(/(\d+)(st|nd|rt|th)/);
        if (match) {
            var day = Number(match[0].substring(0, match.length - 2));
            var currentTime = new Date();
            if (day > new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 0).getDate())
                day = new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 0).getDate();
            if (day <= currentTime.getDate()) {
                days = new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 0).getDate() - currentTime.getDate() + day - 1;
            }
            else {
                days = day - currentTime.getDate() - 1;
            }
            hours = 24 - currentTime.getHours();
            minutes = 60 - currentTime.getMinutes();
            seconds = 60 - currentTime.getSeconds();
        }
        match = arg.match(/\d+d/);
        if (match)
            days += Number(match[0].substring(0, match[0].length - 1));
        match = arg.match(/\d+h/);
        if (match)
            hours += Number(match[0].substring(0, match[0].length - 1));
        match = arg.match(/\d+m/);
        if (match)
            minutes += Number(match[0].substring(0, match[0].length - 1));
        match = arg.match(/\d+s/);
        if (match)
            seconds += Number(match[0].substring(0, match[0].length - 1));
        const totalHours = (days * 24) + hours;
        const totalMinutes = (totalHours * 60) + minutes;
        const totalSeconds = (totalMinutes * 60) + seconds;
        return totalSeconds * 1000;
    }
    /**
     * Humanize a date
     * @param date The date to humanize
     * @returns A humanized date
     */
    static humanizeDate(date, format = '%d/%mo/%y at %h/%m/%s') {
        return format.replace(/%d/g, date.getDate() + '')
            .replace(/%mo/g, date.getMonth() + '')
            .replace(/%y/g, date.getFullYear() + '')
            .replace(/%h/g, date.getHours() + '')
            .replace(/%m/g, date.getMinutes() + '')
            .replace(/%s/g, date.getSeconds() + '');
    }
    /**
     * Huminize a millisecond duration
     * @param millis The millisecond duration
     * @returns The humanized muillisecond duration
     */
    static humanizeMillisTime(millis, format = '%d days, %h hours, %m minutes and %s secondes') {
        var days = Math.floor(millis / (24 * 60 * 60 * 1000));
        millis -= days * (24 * 60 * 60 * 1000);
        var hours = Math.floor(millis / (60 * 60 * 1000));
        millis -= hours * (60 * 60 * 1000);
        var minutes = Math.floor(millis / (60 * 1000));
        millis -= minutes * (60 * 1000);
        var seconds = Math.floor(millis / 1000);
        millis -= seconds * 1000;
        return format.replace(/%d/g, days + '')
            .replace(/%h/g, hours + '')
            .replace(/%m/g, minutes + '')
            .replace(/%s/g, seconds + '');
    }
}
exports.DateUtils = DateUtils;
