import { NS } from "@ns"

/**
 * Total Ways to Sum II
 */
export function totalWaysToSumII(ns: NS, input: any): string {
    const [target, numbers] = input as [number, number[]]
    const dp = new Array(target + 1).fill(0)
    dp[0] = 1
    numbers.sort((a, b) => a - b)

    for (const number of numbers) {
        for (let right = 0; right < dp.length; right++) {
            const left = right - number
            if (left < 0) {
                continue
            }

            dp[right] = dp[left] + dp[right]
        }
    }

    return dp[dp.length - 1].toString()
}
