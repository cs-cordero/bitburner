import { NS } from "@ns"
import { getFlagOnlyArgs } from "/lib/util"

/**
 * Executes share() on a server.
 */
export async function main(ns: NS): Promise<void> {
    const args = getFlagOnlyArgs(ns)

    if (args.check) {
        ns.tprint(ns.getSharePower())
    } else {
        while (true) {
            await ns.share()
        }
    }
}
