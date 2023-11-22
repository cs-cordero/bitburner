import { NS } from "@ns";
import { formatMs, formulasApiActive, getPrintFunc, getPwndServers, Process, waitUntilPidFinishes, } from "/lib/util";

/**
 * Long-running process that launches big hack attacks at servers with maxed out money.
 * Meant to be used from "home" server.
 */
export async function main(ns: NS): Promise<void> {
    const print = getPrintFunc(ns);

    const memCost = ns.getScriptRam("hack.js")

    if (formulasApiActive(ns)) {
        const targeted: Set<Process> = new Set()
        while (true) {
            // check for completed tasks
            const procsToRemove = [...targeted].filter(proc => !ns.isRunning(proc.pid, proc.hostname))
            procsToRemove.forEach(proc => targeted.delete(proc))

            const alreadyTargetedHosts = [...targeted].map(proc => proc.target!)
            const targets = getTargets(ns)
                .filter(target => !(ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target) && !ns.args.includes("--force")))
                .filter(target => !alreadyTargetedHosts.includes(target))

            for (const target of targets) {
                const hackTime = formatMs(ns.getHackTime(target))
                const hackPctPerThread = ns.formulas.hacking.hackPercent(ns.getServer(target), ns.getPlayer())
                const hackThreadsNeeded = Math.ceil(1 / hackPctPerThread)

                // leave free around 32GB if it's available.
                const memFree = ns.getServerMaxRam(ns.getHostname()) - ns.getServerUsedRam(ns.getHostname()) - 32
                const freeThreads = Math.floor(memFree / memCost);

                const threads = Math.min(freeThreads, hackThreadsNeeded)

                if (threads > 0) {
                    print(`[AI-HACK] Target ${target}: Using ${threads} threads. Expected completion in ${hackTime}...`)
                    const pid = ns.exec("hack.js", ns.getHostname(), { threads }, target, threads, "--silent", "--once")
                    const proc: Process = {
                        pid,
                        target,
                        hostname: ns.getHostname(),
                        threads
                    }
                    targeted.add(proc)
                }
            }

            await ns.sleep(1000)
        }
    } else {
        while (true) {
            // leave free around 10GB if it's available.
            const memFree = Math.max(0, ns.getServerMaxRam(ns.getHostname()) - ns.getServerUsedRam(ns.getHostname()) - 16)
            const threads = Math.floor(memFree / memCost);

            if (threads > 0) {
                const targets = getTargets(ns)

                if (!targets.length) {
                    print("[AI-HACK] No targets to hack.")
                }

                for (const target of targets) {
                    if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)) {
                        // only run hack() against flush targets
                        continue
                    }

                    const hackTime = formatMs(ns.getHackTime(target))

                    print(`[AI-HACK] Target ${target}: Using ${threads} threads. Expected completion in ${hackTime}...`)
                    await waitUntilPidFinishes(ns, ns.exec("hack.js", ns.getHostname(), { threads }, target, threads, "--silent", "--once"))
                    print(`[AI-HACK] Target ${target}: Using ${threads} threads. Completed.`)
                    break;
                }
            }

            await ns.sleep(10000);
        }
    }
}

function getTargets(ns: NS) {
    const targets = getPwndServers(ns)
        .filter(target => !ns.getPurchasedServers().includes(target))
        .filter(target => target !== "home")
        .filter(target => ns.getServerMoneyAvailable(target) >= ns.getServerMaxMoney(target) || ns.args.includes("--force"))
        .filter(target => ns.getServerMoneyAvailable(target) > 0)
    targets.sort((a, b) => {
        const evTargetA = ns.getServerMoneyAvailable(a) * ns.hackAnalyzeChance(a);
        const evTargetB = ns.getServerMoneyAvailable(b) * ns.hackAnalyzeChance(b);
        return evTargetB - evTargetA
    })

    return targets
}