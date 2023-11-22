import { NS } from "@ns";

/**
 * Fires off the monitor scripts.
 */
export async function main(ns: NS): Promise<void> {
    ns.run("monitor-fleet.js")
    ns.run("monitor-home.js")
    ns.run("monitor-times.js")
}