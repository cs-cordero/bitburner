import { NS } from "@ns"
import { getTargetableServers } from "/lib/util"
import {
    allocateFleetThreadsForScript,
    estimateWeakenThreadToMinimize,
    executeScriptThreadAllocations,
} from "/lib/threads"

/**
 * Long-running process that tries to keep all pwned servers at their minimum security level.
 * Distributes load to pwned servers based using a thread allocation.
 */
export async function main(ns: NS): Promise<void> {
    while (true) {
        for (const server of getTargetableServers(ns)) {
            const weakenThreadsNeeded = estimateWeakenThreadToMinimize(ns, server)
            if (weakenThreadsNeeded <= 0) {
                continue
            }

            const threadAllocation = allocateFleetThreadsForScript(ns, "weaken.js", weakenThreadsNeeded)
            executeScriptThreadAllocations(ns, server, threadAllocation)
            await ns.sleep(100)
        }
        await ns.sleep(5000)
    }
}
