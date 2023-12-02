import { NS } from "@ns"
import { getFleetThreadManifest, getHomeThreadManifest } from "/lib/threads"

/**
 * Provides information on the ever-important "home" server.
 */
export async function main(ns: NS): Promise<void> {
    ns.tail()
    ns.disableLog("ALL")
    while (true) {
        const homeThreadManifest = getHomeThreadManifest(ns)
        const fleetThreadManifest = getFleetThreadManifest(ns)

        ns.clearLog()
        ns.print(`Home Threads: ${homeThreadManifest.free} available out of ${homeThreadManifest.max}`)
        ns.ps("home")
            .sort((a, b) => a.filename.localeCompare(b.filename))
            .forEach((p) => ns.print(`  ${p.threads} ${p.filename} ${p.args} (PID ${p.pid})`))
        ns.print("\n===========\n\n")
        ns.print(`Fleet Threads: ${fleetThreadManifest.free} available out of ${fleetThreadManifest.max}`)
        fleetThreadManifest.weaken && ns.print(`  ${fleetThreadManifest.weaken} weaken.js`)
        fleetThreadManifest.grow && ns.print(`  ${fleetThreadManifest.grow} grow.js`)
        fleetThreadManifest.hack && ns.print(`  ${fleetThreadManifest.hack} hack.js`)
        fleetThreadManifest.share && ns.print(`  ${fleetThreadManifest.share} share.js`)
        await ns.sleep(200)
    }
}
