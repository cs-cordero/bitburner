import { NS } from "@ns";

/**
 * Proper 2-Coloring of a Graph
 *
 * You are given the following data, representing a graph:
 * [9,[[6,8],[0,4],[3,4],[3,5],[1,7],[0,2],[1,2],[3,7],[5,8],[1,5],[4,8],[1,6],[0,6]]]
 * Note that "graph", as used here, refers to the field of graph theory, and has no relation to statistics or plotting. The first element of the data represents the number of vertices in the graph. Each vertex is a unique number between 0 and 8. The next element of the data represents the edges of the graph. Two vertices u,v in a graph are said to be adjacent if there exists an edge [u,v]. Note that an edge [u,v] is the same as an edge [v,u], as order does not matter. You must construct a 2-coloring of the graph, meaning that you have to assign each vertex in the graph a "color", either 0 or 1, such that no two adjacent vertices have the same color. Submit your answer in the form of an array, where element i represents the color of vertex i. If it is impossible to construct a 2-coloring of the given graph, instead submit an empty array.
 *
 * Examples:
 *
 * Input: [4, [[0, 2], [0, 3], [1, 2], [1, 3]]]
 * Output: [0, 0, 1, 1]
 *
 * Input: [3, [[0, 1], [0, 2], [1, 2]]]
 * Output: []
 */
export async function main(ns: NS): Promise<void> {
    const input: [number, [number, number][]] = [9,[[6,8],[0,4],[3,4],[3,5],[1,7],[0,2],[1,2],[3,7],[5,8],[1,5],[4,8],[1,6],[0,6]]]
    const [vertexCount, edges] = input

    const graph: {[vertex: number]: number[]} = {}
    for (let vertex = 0; vertex < vertexCount; vertex++) {
        graph[vertex] = []
    }

    for (const [source, target] of edges) {
        graph[source].push(target)
        graph[target].push(source)
    }

    const colors: number[] = new Array(vertexCount).fill(-1)
    colors[0] = 0

    const seen = new Set()
    const queue = [0]
    while (queue.length) {
        const vertex = queue.shift()!
        if (seen.has(vertex)) {
            continue
        }
        seen.add(vertex)
        const color = colors[vertex]
        const expectedNeighborColor = color === 0 ? 1 : 0
        for (const neighbor of graph[vertex]) {
            const neighborColor = colors[neighbor]
            if (neighborColor !== -1 && neighborColor !== expectedNeighborColor) {
                // fail
                ns.tprint("Failed: []")
                return
            } else {
                colors[neighbor] = expectedNeighborColor
                queue.push(neighbor)
            }
        }
    }

    ns.tprint(colors)
}