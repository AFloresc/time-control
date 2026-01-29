export function formatDuration(seconds) {
    const safe = Number.isFinite(seconds) ? seconds : 0;

    const h = Math.floor(safe / 3600);
    const m = Math.floor((safe % 3600) / 60);
    const s = safe % 60;

    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}

export function getProgressColor(seconds) {
    if (seconds < 4 * 3600) return "success.main";
    if (seconds < 6 * 3600) return "warning.main";
    return "error.main";
}

export function getDuration(start, end) {
    const startTime = new Date(start);
    const endTime = new Date(end);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) return 0;

    return Math.floor((endTime - startTime) / 1000);
}

export function isSameDay(a, b) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

export function getISOWeek(date) {
    const temp = new Date(date.getTime());
    temp.setHours(0, 0, 0, 0);
    temp.setDate(temp.getDate() + 3 - ((temp.getDay() + 6) % 7));
    const week1 = new Date(temp.getFullYear(), 0, 4);
    return (
        1 +
        Math.round(
            ((temp.getTime() - week1.getTime()) / 86400000 -
                3 +
                ((week1.getDay() + 6) % 7)) /
            7
        )
    );
}