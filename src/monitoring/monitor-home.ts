import { NS, ProcessInfo } from "@ns"
import { getFleetThreadManifest, getHomeThreadManifest } from "/lib/threads"
import { EVERGREEN_SCRIPTS } from "/lib/util";

/**
 * Provides information on the ever-important "home" server.
 */
export async function main(ns: NS): Promise<void> {
    ns.tail()
    ns.disableLog("ALL")
    while (true) {
        const homeThreadManifest = getHomeThreadManifest(ns)
        const fleetThreadManifest = getFleetThreadManifest(ns)

        const availableFarm = Math.min(homeThreadManifest.max - homeThreadManifest.farm, homeThreadManifest.free)
        const availableFleetFarm = Math.min(fleetThreadManifest.max - homeThreadManifest.fleetFarm, fleetThreadManifest.free)

        const printHomeProcess = (p: ProcessInfo) => ns.print(`  ${p.threads} ${p.filename} ${p.args} (PID ${p.pid})`)

        const homeProcs = ns.ps("home")
            .sort((a, b) => {
                const aIsEvergreen = EVERGREEN_SCRIPTS.includes(a.filename)
                const bIsEvergreen = EVERGREEN_SCRIPTS.includes(b.filename)
                if (aIsEvergreen && !bIsEvergreen) {
                    return -1
                } else if (!aIsEvergreen && bIsEvergreen) {
                    return 1
                } else {
                    return a.filename.localeCompare(b.filename)
                }
            })

        ns.clearLog()
        ns.print(`Home Threads: ${homeThreadManifest.free} available out of ${homeThreadManifest.max}`)
        ns.print(`              ${availableFarm} farm threads available out of ${homeThreadManifest.max}`)
        homeProcs.forEach(proc => printHomeProcess(proc))

        ns.print("\n===========\n\n")

        ns.print(`Fleet Threads: ${fleetThreadManifest.free} available out of ${fleetThreadManifest.max}`)
        ns.print(`               ${availableFleetFarm} fleet-farm threads available out of ${fleetThreadManifest.max}`)
        fleetThreadManifest.weaken && ns.print(`  ${fleetThreadManifest.weaken} weaken.js`)
        fleetThreadManifest.grow && ns.print(`  ${fleetThreadManifest.grow} grow.js`)
        fleetThreadManifest.hack && ns.print(`  ${fleetThreadManifest.hack} hack.js`)
        fleetThreadManifest.share && ns.print(`  ${fleetThreadManifest.share} share.js`)
        await ns.sleep(200)
    }
}
