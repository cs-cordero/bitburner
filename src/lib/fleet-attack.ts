import { getPrintFunc, ProcessWatcher, TargetedScriptArgs } from "/lib/util";
import { allocateFleetThreadsForScript, executeScriptThreadAllocations } from "/lib/threads";
import { NS } from "@ns";

/**
 * Orders the fleet to hack(), grow(), or weaken() a single target with a specified number of threads.
 */
export async function fleetAttack(ns: NS, scriptName: "hack.js" | "weaken.js" | "grow.js", args: TargetedScriptArgs) {
    const print = getPrintFunc(ns, args.silent)

    const watcher = new ProcessWatcher(ns)
    while (true) {
        watcher.tick()

        const neededThreads = args.threads - watcher.threadsActive()
        if (neededThreads > 0) {
            const allocations = allocateFleetThreadsForScript(ns, scriptName, neededThreads)
            const procs = executeScriptThreadAllocations(ns, args.target, allocations)
            watcher.watch(...procs)

            const threadsStarted = procs.map(proc => proc.threads).reduce((a, b) => a + b)
            const hostnamesUsed = new Set(procs.map(proc => proc.hostname)).size
            print(`Started ${threadsStarted} threads across ${hostnamesUsed} servers targeting ${args.target}.`)
        }

        if (args.once) {
            break
        }

        await ns.sleep(2000)
    }
}