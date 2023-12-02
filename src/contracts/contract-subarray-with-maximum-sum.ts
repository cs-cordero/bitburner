import { NS } from "@ns"

/**
 * Subarray with Maximum Sum
 */
export function subarrayWithMaximumSum(ns: NS, input: any): string {
    const numbers = input as number[]

    if (!numbers.length) {
        return "0"
    }

    let maxSum = -Infinity
    let currentSum = -Infinity
    for (const number of numbers) {
        currentSum = Math.max(number, currentSum + number)
        maxSum = Math.max(maxSum, currentSum)
    }

    return maxSum.toString()
}
