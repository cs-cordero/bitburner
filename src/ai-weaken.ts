import { NS } from "@ns";
import {
    allocateThreadsForScript,
    getNumberOfWeakenThreadsNeeded,
    getPrintFunc,
    getPwndServers,
} from "/util";

/**
 * Long-running process that tries to keep all pwned servers at their minimum security level.
 * Distributes load to pwned servers based using a thread allocation.
 */
export async function main(ns: NS): Promise<void> {
    const print = getPrintFunc(ns);

    const targeted: Set<string> = new Set();
    while (true) {
        for (const target of getPwndServers(ns)) {
            if (targeted.has(target)) {
                continue;
            }
            const weakenThreadsNeeded = getNumberOfWeakenThreadsNeeded(ns, target);
            const weakenAlloc = allocateThreadsForScript(ns, "weaken.js", weakenThreadsNeeded);
            const totalThreads = weakenAlloc.map(alloc => alloc.threads).reduce((a, b) => a + b, 0);

            weakenAlloc
                .forEach(({ hostname, scriptName, threads}) => {
                    ns.exec(scriptName, hostname, { threads }, target, threads, "--once")
                })
            if (weakenAlloc.length) {
                print(`[AI-WEAKEN] Target ${target}: Orchestration information`)
                print(`\tUsing ${totalThreads} threads across ${weakenAlloc.length} hosts.`)
                const counts = weakenAlloc.map(alloc => `${alloc.hostname} ${alloc.threads}`).join(", ")
                print(`\t${counts}`)
                targeted.add(target);
            }
        }

        await ns.sleep(10000);
    }
}