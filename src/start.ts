import { NS } from "@ns"

/**
 * Fires off the monitor scripts.
 */
export async function main(ns: NS): Promise<void> {
    ns.run("subscripts/monitor-fleet.js")
    ns.run("subscripts/monitor-home.js")
    ns.run("sync.js")
    ns.run("contracts.js", undefined, "--submit")
}
