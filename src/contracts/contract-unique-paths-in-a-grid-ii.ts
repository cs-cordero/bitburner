import { NS } from "@ns"

/**
 * Unique Paths in a Grid II
 */
export function uniquePathsInAGridII(ns: NS, input: any): string {
    const grid = input as number[][]
    const rows = grid.length
    const cols = grid[0].length

    const dp: number[][] = []
    for (let row = 0; row < rows; row++) {
        const newRow = []
        for (let col = 0; col < cols; col++) {
            newRow.push(0)
        }
        dp.push(newRow)
    }
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (row === 0 && col === 0) {
                dp[row][col] = 1
                continue
            }

            if (grid[row][col] === 1) {
                continue
            }

            const pathsFromLeft = col - 1 >= 0 ? dp[row][col - 1] : 0
            const pathsFromAbove = row - 1 >= 0 ? dp[row - 1][col] : 0
            dp[row][col] = pathsFromLeft + pathsFromAbove
        }
    }

    return dp[rows - 1][cols - 1].toString()
}
