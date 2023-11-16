import { NS } from "@ns";

/**
 * Unique Paths in a Grid II
 *
 * You are located in the top-left corner of the following grid:
 *
 * 0,0,0,0,0,1,1,0,0,0,0,
 * 0,0,1,0,0,0,0,0,0,0,1,
 * 0,0,0,0,0,0,0,0,0,1,0,
 * 0,0,0,0,0,0,0,0,0,0,0,
 * 1,0,0,0,0,1,0,0,1,0,0,
 * 0,0,0,1,0,0,0,0,0,0,0,
 * 0,0,0,0,1,1,0,0,0,0,0,
 * 0,1,1,0,0,0,0,0,0,0,0,
 * 0,0,0,0,0,0,0,0,0,0,0,
 * 0,0,0,0,0,0,0,0,0,0,0,
 *
 * You are trying reach the bottom-right corner of the grid, but you can only move down or right on each step. Furthermore, there are obstacles on the grid that you cannot move onto. These obstacles are denoted by '1', while empty spaces are denoted by 0.
 *
 * Determine how many unique paths there are from start to finish.
 *
 * NOTE: The data returned for this contract is an 2D array of numbers representing the grid.
 * @param ns
 */
export async function main(ns: NS): Promise<void> {
    const grid = [
        [0,0,0,0,0,1,1,0,0,0,0],
        [0,0,1,0,0,0,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,0,1,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [1,0,0,0,0,1,0,0,1,0,0],
        [0,0,0,1,0,0,0,0,0,0,0],
        [0,0,0,0,1,1,0,0,0,0,0],
        [0,1,1,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
    ]
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

    for (let row = 0; row < rows; row++) {
        const value = dp[row].map(number => number.toString().padStart(4)).join(",")
        ns.tprint(`[${value}]`)
    }

    ns.tprint(dp[rows - 1][cols - 1])
}