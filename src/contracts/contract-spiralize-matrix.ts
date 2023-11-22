import { NS } from "@ns";

/**
 * Spiralize Matrix
 */
export function spiralizeMatrix(ns: NS, input: any): string {
    const matrix = input as number[][]

    const rows = matrix.length
    const cols = matrix[0].length

    const seen: Set<string> = new Set()
    seen.add("0,0")
    let row = 0
    let col = 0

    const spiralized = []
    spiralized.push(matrix[0][0])

    while (true) {
        // right
        while (col + 1 < cols && !seen.has(`${row},${col + 1}`)) {
            seen.add(`${row},${col + 1}`)
            col += 1
            spiralized.push(matrix[row][col])
        }

        // down
        while (row + 1 < rows && !seen.has(`${row + 1},${col}`)) {
            seen.add(`${row + 1},${col}`)
            row += 1
            spiralized.push(matrix[row][col])
        }

        // left
        while (col - 1 >= 0 && !seen.has(`${row},${col - 1}`)) {
            seen.add(`${row},${col - 1}`)
            col -= 1
            spiralized.push(matrix[row][col])
        }

        // up
        while (row - 1 >= 0 && !seen.has(`${row - 1},${col}`)) {
            seen.add(`${row - 1},${col}`)
            row -= 1
            spiralized.push(matrix[row][col])
        }

        // check right if we're done
        if (col + 1 >= cols || seen.has(`${row},${col + 1}`)) {
            break
        }
    }

    return `[${spiralized}]`
}