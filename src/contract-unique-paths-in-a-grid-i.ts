import { NS } from "@ns";

/**
 * Unique Paths in a Grid I
 *
 * You are in a grid with 6 rows and 11 columns, and you are positioned in the top-left corner of
 * that grid. You are trying to reach the bottom-right corner of the grid, but you can only move
 * down or right on each step. Determine how many unique paths there are from start to finish.
 *
 * NOTE: The data returned for this contract is an array with the number of rows and columns:
 * [6, 11]
 *
 * @param ns
 */
export async function main(ns: NS): Promise<void> {
    const [rows, cols] = [5, 2]

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

            const pathsFromLeft = col - 1 >= 0 ? dp[row][col - 1] : 0
            const pathsFromAbove = row - 1 >= 0 ? dp[row - 1][col] : 0
            dp[row][col] = pathsFromLeft + pathsFromAbove
        }
    }

    for (let row = 0; row < rows; row++) {
        const value = dp[row].map(number => number.toString().padStart(4)).join(",")
        ns.tprint(`[${value}]`)
    }

    ns.tprint(dp[rows - 1][cols - 1])
}