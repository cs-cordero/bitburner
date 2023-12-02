import { NS } from "@ns"
import { totalWaysToSumII } from "/contracts/contract-total-ways-to-sum-ii"

/**
 * Total Ways to Sum I
 */
export function totalWaysToSumI(ns: NS, input: any): string {
    const target = input as number
    const nums = [...new Array(target).keys()].filter((num) => num !== 0).filter((num) => num !== target)
    return totalWaysToSumII(ns, [target, nums])
}
