import { NS } from "@ns";
import {
    allocateThreadsForScript, formatMs, getNumberOfGrowThreads,
    getPrintFunc,
    getPwndServers, isNumber, Process
} from "/util";

/**
 * Long-running process that tries to grow the money in every server, keeping security level minimized.
 * Distributes load to pwned servers based using a thread allocation.
 */
export async function main(ns: NS): Promise<void> {
    const memCost = Math.max(ns.getScriptRam("grow.js"), ns.getScriptRam("weaken.js"))
    const print = getPrintFunc(ns);

    const desiredThreadCount = ns.args[0];
    if (!isNumber(desiredThreadCount)) {
        throw Error("First argument to ai-grow should be the number of threads you want to use across your pwned servers")
    }
    const desiredHostCount = ns.args[1];
    if (!isNumber(desiredHostCount)) {
        throw Error("Second argument to ai-grow should be the number of host you want to grow concurrently.")
    }
    const approximateThreadsPerTarget = Math.floor(desiredThreadCount / desiredHostCount)

    print(`Desired thread count is ${desiredThreadCount}.`)
    print(`Desired host count is ${desiredHostCount}.`)
    print(`AI-GROW will allocate approximately ${Math.floor(desiredThreadCount / desiredHostCount)} threads per target.`)

    let remainingThreads = desiredThreadCount
    const targeted: Set<Process> = new Set()
    while (true) {
        // check to see if any processes are done
        const procsToRemove: Process[] = []
        for (const proc of targeted) {
            if (!ns.isRunning(proc.pid, proc.hostname)) {
                remainingThreads += proc.threads
                // print(`${proc.hostname}:${proc.pid} completed, removing. Remaining threads now ${remainingThreads}`)
                procsToRemove.push(proc)
            }
        }
        procsToRemove.forEach(proc => targeted.delete(proc))

        // try to open new procs if possible
        const alreadyTargetedHosts = [... new Set([...targeted.values()].map(proc => proc.target!))]
        const targets = getPwndServers(ns)
            .filter(hostname => !alreadyTargetedHosts.includes(hostname))
            .filter(hostname => ns.getServerMoneyAvailable(hostname) < ns.getServerMaxMoney(hostname))
            .filter(hostname => !ns.getPurchasedServers().includes(hostname))
            .filter(hostname => hostname !== "home")

        for (const target of targets) {
            const threadsInFleet = getPwndServers(ns)
                .map(hostname => ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname))
                .map(freeRam => Math.floor(freeRam / memCost))
                .reduce((a, b) => a + b, 0)

            if (Math.min(remainingThreads, threadsInFleet) < approximateThreadsPerTarget) {
                const hostCount = [... new Set([...targeted.values()].map(proc => proc.target!))].length
                if (hostCount < desiredHostCount) {
                    print(`[AI-GROW] No resources available!`)
                }
                break;
            }

            let threadsToUse;
            if (remainingThreads > approximateThreadsPerTarget && remainingThreads < approximateThreadsPerTarget * 2) {
                threadsToUse = Math.min(remainingThreads, threadsInFleet)
            } else {
                threadsToUse = Math.min(approximateThreadsPerTarget, threadsInFleet)
            }

            const growThreads = getNumberOfGrowThreads(threadsToUse, 9)
            const weakenThreads = threadsToUse - growThreads
            const growProcsCreated: Process[] = []
            const weakenProcsCreated: Process[] = []

            const growAllocation = allocateThreadsForScript(ns, "grow.js", growThreads)
            growAllocation.forEach(alloc => {
                const { threads, hostname, scriptName } = alloc;
                const pid = ns.exec(scriptName, hostname, { threads }, target, threads, "--silent", "--once")
                const proc = { pid, hostname, threads, target };
                targeted.add(proc)
                growProcsCreated.push(proc)
                remainingThreads -= threads
            })

            // this allocation must occur after the grow exec() calls.
            const weakenAllocation = allocateThreadsForScript(ns, "weaken.js", weakenThreads)
            weakenAllocation.forEach(alloc => {
                const { threads, hostname, scriptName } = alloc;
                const pid = ns.exec(scriptName, hostname, { threads }, target, threads, "--silent", "--once")
                const proc = { pid, hostname, threads, target };
                targeted.add(proc)
                weakenProcsCreated.push(proc)
                remainingThreads -= threads
            })

            const expectedTime = formatMs(Math.max(ns.getWeakenTime(target), ns.getGrowTime(target)))
            const hostCount = new Set([...growProcsCreated, ...weakenProcsCreated].map(proc => proc.hostname)).size
            print(`[AI-GROW] Target ${target}: Orchestration information`)
            print(`    Using ${threadsToUse} threads across ${hostCount} hosts. Expected completion in ${expectedTime}`)
        }

        await ns.sleep(10000);
    }
}
