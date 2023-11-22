import { NS } from "@ns"

/**
 * Minimum Path Sum in a Triangle
 */
export function minPathSumInTriangle(ns: NS, input: any): string {
    const triangle = input as number[][]
    return helper(triangle, 0, 0, 0).toString()
}

function helper(
    triangle: number[][],
    row: number,
    col: number,
    currentSum: number
): number {
    if (row === triangle.length) {
        return currentSum
    }

    const nextSum = currentSum + triangle[row][col]
    return Math.min(
        helper(triangle, row + 1, col, nextSum),
        helper(triangle, row + 1, col + 1, nextSum)
    )
}
