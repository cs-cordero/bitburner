import { NS } from "@ns"

interface Point {
    row: number
    col: number
}

/**
 * Shortest Path In A Grid
 */
export function shortestPathInAGrid(ns: NS, input: any): string {
    const graph = input as number[][]
    const rows = graph.length
    const cols = graph[0].length

    const seen: Set<string> = new Set()
    seen.add("0x0")
    const queue: [Point, string][] = [[{ row: 0, col: 0 }, ""]]
    let i = 0
    while (queue.length) {
        const current = queue.shift()!
        const [point, path] = current
        const row = point.row
        const col = point.col

        if (row === rows - 1 && col === cols - 1) {
            return path
        }

        const up: Point = { row: row - 1, col }
        const down: Point = { row: row + 1, col }
        const left: Point = { row, col: col - 1 }
        const right: Point = { row, col: col + 1 }

        if (isValidPoint(up, rows, cols) && graph[up.row][up.col] !== 1 && !seen.has(toString(up))) {
            seen.add(toString(up))
            queue.push([up, `${path}U`])
        }
        if (isValidPoint(down, rows, cols) && graph[down.row][down.col] !== 1 && !seen.has(toString(down))) {
            seen.add(toString(down))
            queue.push([down, `${path}D`])
        }
        if (isValidPoint(left, rows, cols) && graph[left.row][left.col] !== 1 && !seen.has(toString(left))) {
            seen.add(toString(left))
            queue.push([left, `${path}L`])
        }
        if (isValidPoint(right, rows, cols) && graph[right.row][right.col] !== 1 && !seen.has(toString(right))) {
            seen.add(toString(right))
            queue.push([right, `${path}R`])
        }
    }

    return ""
}

function isValidPoint(point: Point, rows: number, cols: number): boolean {
    const row = point.row
    const col = point.col
    return row >= 0 && row < rows && col >= 0 && col < cols
}

function toString(point: Point): string {
    return `${point.row}x${point.col}`
}
