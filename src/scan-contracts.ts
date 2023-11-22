import { NS } from "@ns"
import { getAllServers } from "/lib/util"

/**
 * Low-RAM method of checking all servers in the game for available contracts.
 */
export async function main(ns: NS): Promise<void> {
    while (true) {
        getAllServers(ns).forEach((hostname) => {
            const files = ns
                .ls(hostname)
                .filter((fn) => fn.endsWith(".cct"))
                .join(", ")
            if (files.length) {
                ns.tprint(`${hostname.padEnd(18)}${files}`)
            }
        })

        await ns.sleep(10000)
    }
}
