import { NS } from "@ns"

/**
 * Fires off the monitor scripts.
 */
export async function main(ns: NS): Promise<void> {
    ns.run("monitoring/monitor-fleet.js")
    ns.run("monitoring/monitor-home.js")
    ns.run("sync.js")
    ns.run("contracts.js", undefined, "--silent")

    ns.singularity.universityCourse("Rothman University", "Computer Science", false)
}
