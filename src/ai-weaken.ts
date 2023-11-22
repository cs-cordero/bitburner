import { NS } from "@ns"
import {
    allocateThreadsForScript,
    formatMs,
    getNumberOfWeakenThreadsNeeded,
    getPrintFunc,
    getPwndServers,
    Process,
} from "/lib/util"

/**
 * Long-running process that tries to keep all pwned servers at their minimum security level.
 * Distributes load to pwned servers based using a thread allocation.
 */
export async function main(ns: NS): Promise<void> {
    const print = getPrintFunc(ns)

    const targeted: Set<Process> = new Set()
    while (true) {
        const procsToDelete = []
        for (const proc of targeted) {
            if (!ns.isRunning(proc.pid, proc.hostname)) {
                procsToDelete.push(proc)
            }
        }
        procsToDelete.forEach((proc) => targeted.delete(proc))

        for (const target of getPwndServers(ns)) {
            let weakenThreadsNeeded = getNumberOfWeakenThreadsNeeded(ns, target)

            const weakenThreadsExecuting = [...targeted]
                .filter((proc) => proc.target === target)
                .map((proc) => proc.threads)
                .reduce((a, b) => a + b, 0)

            weakenThreadsNeeded = Math.max(
                0,
                weakenThreadsNeeded - weakenThreadsExecuting
            )

            if (weakenThreadsNeeded <= 0) {
                continue
            }
            if (ns.getPurchasedServers().includes(target)) {
                continue
            }

            const weakenAlloc = allocateThreadsForScript(
                ns,
                "weaken.js",
                weakenThreadsNeeded
            )
            const totalThreads = weakenAlloc
                .map((alloc) => alloc.threads)
                .reduce((a, b) => a + b, 0)
            const weakenTime = formatMs(ns.getWeakenTime(target))

            weakenAlloc
                .map(({ hostname, scriptName, threads }) => {
                    const pid = ns.exec(
                        scriptName,
                        hostname,
                        { threads },
                        target,
                        threads,
                        "--silent",
                        "--once"
                    )
                    const proc: Process = {
                        pid,
                        hostname,
                        threads,
                        target,
                    }
                    return proc
                })
                .forEach((proc) => targeted.add(proc))

            if (weakenAlloc.length) {
                print(`[AI-WEAKEN] Target ${target}: Orchestration information`)
                print(
                    `\tUsing ${totalThreads} threads across ${weakenAlloc.length} hosts. Expected completion in ${weakenTime}...`
                )
                const counts = weakenAlloc
                    .map((alloc) => `${alloc.hostname} ${alloc.threads}`)
                    .join(", ")
                print(`\t${counts}`)
            }

            await ns.sleep(500)
        }

        await ns.sleep(1000)
    }
}
