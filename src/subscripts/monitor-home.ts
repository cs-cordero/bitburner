import { NS } from "@ns"
import { getPwndServers } from "/lib/util"

/**
 * Provides information on the ever-important "home" server.
 */
export async function main(ns: NS): Promise<void> {
    ns.tail()
    ns.disableLog("ALL")
    while (true) {
        const memCost = Math.max(
            ns.getScriptRam("hack.js", "home"),
            ns.getScriptRam("grow.js", "home"),
            ns.getScriptRam("weaken.js", "home")
        )

        const maxRam = ns.getServerMaxRam("home")
        const usedRam = ns.getServerUsedRam("home")
        const freeRam = maxRam - usedRam
        const threadsMax = Math.floor(maxRam / memCost)
        const threadsFree = Math.floor(freeRam / memCost)

        let fleetThreadsMax = 0
        let fleetThreadsFree = 0
        let fleetWeakenThreads = 0
        let fleetHackThreads = 0
        let fleetGrowThreads = 0
        let fleetShareThreads = 0
        for (const pwndServer of getPwndServers(ns)) {
            const maxRam = ns.getServerMaxRam(pwndServer)
            const usedRam = ns.getServerUsedRam(pwndServer)
            const freeRam = maxRam - usedRam
            fleetThreadsMax += Math.floor(maxRam / memCost)
            fleetThreadsFree += Math.floor(freeRam / memCost)

            for (const proc of ns.ps(pwndServer)) {
                if (proc.filename === "weaken.js") {
                    fleetWeakenThreads += proc.threads
                } else if (proc.filename === "grow.js") {
                    fleetGrowThreads += proc.threads
                } else if (proc.filename === "hack.js") {
                    fleetHackThreads += proc.threads
                } else if (proc.filename === "share.js") {
                    fleetShareThreads += proc.threads
                }
            }
        }

        ns.clearLog()
        ns.print(`Home Threads: ${threadsFree} available out of ${threadsMax}`)
        ns.ps("home")
            .sort((a, b) => a.filename.localeCompare(b.filename))
            .forEach((p) =>
                ns.print(
                    `  ${p.threads} ${p.filename} ${p.args} (PID ${p.pid})`
                )
            )
        ns.print("\n===========\n\n")
        ns.print(
            `Fleet Threads: ${fleetThreadsFree} available out of ${fleetThreadsMax}`
        )
        fleetWeakenThreads && ns.print(`  ${fleetWeakenThreads} weaken.js`)
        fleetGrowThreads && ns.print(`  ${fleetGrowThreads} grow.js`)
        fleetHackThreads && ns.print(`  ${fleetHackThreads} hack.js`)
        fleetShareThreads && ns.print(`  ${fleetShareThreads} share.js`)
        await ns.sleep(200)
    }
}
