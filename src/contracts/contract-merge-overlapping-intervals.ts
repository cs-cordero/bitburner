import { NS } from "@ns";

/**
 * Merge Overlapping Intervals
 */
export function mergeOverlappingIntervals(ns: NS, input: any): string {
    const intervals = input as [number, number][]
    intervals.sort((a, b) => {
        if (a[0] === b[0]) {
            return a[1] - b[1]
        } else {
            return a[0] - b[0]
        }
    })

    if (!intervals.length) {
        return "[]"
    }

    const mergedIntervals: [number, number][] = []
    let start = intervals[0][0]
    let end = intervals[0][1]
    for (const [intervalStart, intervalEnd] of intervals) {
        if (intervalStart <= end) {
            end = Math.max(intervalEnd, end)
        } else {
            mergedIntervals.push([start, end])
            start = intervalStart
            end = intervalEnd
        }
    }
    mergedIntervals.push([start, end])

    const merged = mergedIntervals
        .map(([start, end]) => `[${start},${end}]`)
        .join(",")
    return `[${merged}]`
}