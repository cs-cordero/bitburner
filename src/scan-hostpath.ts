import { NS } from "@ns"
import { getTargetedScriptArgs } from "/lib/util"

/**
 * Prints the server path to reach a target.
 */
export async function main(ns: NS): Promise<void> {
    const args = getTargetedScriptArgs(ns)

    ns.tprint(findPathFromHome(ns, args.target).join("->"))
}

export function findPathFromHome(ns: NS, target: string): string[] {
    const seen: Set<string> = new Set()
    seen.add("home")

    const queue: string[][] = [["home"]]
    while (queue.length) {
        const path = queue.shift()!
        const currentHost = path[path.length - 1]
        if (currentHost === target) {
            return path
        }
        for (const neighbor of ns.scan(currentHost)) {
            if (seen.has(neighbor)) {
                continue
            }
            seen.add(neighbor)
            queue.push([...path, neighbor])
        }
    }

    return []
}