import { NS } from "@ns";

/**
 * Array Jumping Game II
 */
export function arrayJumpingGameII(ns: NS, input: any): string {
    const jumps = input as number[]
    const dp: number[] = new Array(jumps.length).fill(9999)
    dp[dp.length - 1] = 0

    for (let i = jumps.length - 2; i >= 0; i--) {
        let j = i
        const furthestJump = Math.min(jumps.length, j + jumps[j] + 1)
        let minJumpsToReachEnd = 99999
        for (; j < furthestJump; j++) {
            minJumpsToReachEnd = Math.min(minJumpsToReachEnd, dp[j])
        }
        dp[i] = minJumpsToReachEnd + 1
    }

    if (dp[0] > dp.length) {
        return "0"
    } else {
        return dp[0].toString()
    }
}