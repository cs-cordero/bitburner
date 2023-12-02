import { NS } from "@ns"

/**
 * Proper 2-Coloring of a Graph
 */
export function proper2ColoringOfGraph(ns: NS, input: any): string {
    const raw: [number, [number, number][]] = input as [number, [number, number][]]

    const [vertexCount, edges] = raw

    const graph: { [vertex: number]: number[] } = {}
    for (let vertex = 0; vertex < vertexCount; vertex++) {
        graph[vertex] = []
    }

    for (const [source, target] of edges) {
        graph[source].push(target)
        graph[target].push(source)
    }

    const colors: number[] = new Array(vertexCount).fill(-1)

    for (let i = 0; i < colors.length; i++) {
        if (colors[i] === -1) {
            colors[i] = 0
        }

        const seen: Set<number> = new Set()
        seen.add(i)

        const queue = [i]
        while (queue.length) {
            const j = queue.shift()!
            const expectedNeighborColor = colors[j] === 0 ? 1 : 0
            const wrongNeighborColor = expectedNeighborColor === 0 ? 1 : 0

            const neighbors = graph[j]
            if (!neighbors.length) {
                continue
            }

            for (const neighbor of neighbors) {
                if (seen.has(neighbor)) {
                    continue
                }
                seen.add(neighbor)

                if (colors[neighbor] === wrongNeighborColor) {
                    return "[]"
                }
                colors[neighbor] = expectedNeighborColor
                queue.push(neighbor)
            }
        }
    }

    return `[${colors}]`
}
