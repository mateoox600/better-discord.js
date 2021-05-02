export declare class DateUtils {
    /**
     * Convert a time string ('1h25s', '6th') in millis
     * @param arg time in string ('1h25s', '6th')
     * @returns time in millis to arg
     */
    static parseTime(arg: string): number;
    /**
     * Humanize a date
     * @param date The date to humanize
     * @returns A humanized date
     */
    static humanizeDate(date: Date, format?: string): string;
    /**
     * Huminize a millisecond duration
     * @param millis The millisecond duration
     * @returns The humanized muillisecond duration
     */
    static humanizeMillisTime(millis: number, format?: string): string;
}
