import { NS } from "@ns";

/**
 * Unique Paths in a Grid I
 */
export function uniquePathsInAGridI(ns: NS, input: any): string {
    const inputAsNumbers = input as number[]

    const rows = inputAsNumbers[0]
    const cols = inputAsNumbers[1]

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

    return dp[rows - 1][cols - 1].toString()
}