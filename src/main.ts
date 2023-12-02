import { NS } from "@ns"
import { formulasApiActive, getPwndServers } from "/lib/util"

export async function main(ns: NS): Promise<void> {
    const fleet = calculateFleetThreads(ns, getPwndServers(ns))
    const threadsToUse = Math.floor(fleet.max * 0.9)
    const totalServerCount = getPwndServers(ns)
        .filter((server) => !ns.getPurchasedServers().includes(server))
        .filter((server) => server !== "home").length
    const hostsToTarget = Math.min(totalServerCount, Math.max(Math.floor(threadsToUse / 1000), 2))

    const args = ns.args.includes("--silent") ? ["--silent"] : []
    ns.run("ai-weaken.js", undefined, ...args)
    if (formulasApiActive(ns)) {
        ns.run("ai-grow.js", undefined, ...args)
    } else {
        ns.run("ai-grow.js", undefined, threadsToUse, hostsToTarget, ...args)
    }
    ns.run("ai-hack.js", undefined, ...args)
}

interface FleetThreadCount {
    used: number
    max: number
}

export function calculateFleetThreads(ns: NS, targets: string[]): FleetThreadCount {
    const memCost = Math.max(ns.getScriptRam("weaken.js"), ns.getScriptRam("grow.js"))
    const threadsMax = targets
        .map((hostname) => ns.getServerMaxRam(hostname))
        .map((ram) => Math.floor(ram / memCost))
        .reduce((a, b) => a + b, 0)
    const threadsActual = targets
        .map((hostname) => ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname))
        .map((ram) => Math.floor(ram / memCost))
        .reduce((a, b) => a + b, 0)

    return {
        used: threadsActual,
        max: threadsMax,
    }
}
