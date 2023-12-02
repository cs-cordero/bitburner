import { NS } from "@ns"
import { getPrintFunc, getTargetedArgumentsOptionalThreads } from "/lib/util"

/**
 * Runs hack() on a target server.
 */
export async function main(ns: NS): Promise<void> {
    const args = getTargetedArgumentsOptionalThreads(ns)
    const print = getPrintFunc(ns, args.silent)

    const sourceHost = ns.getHostname()
    const targetHost = args.target
    const threads = args.threads ?? 1
    while (true) {
        const hackTime = ns.tFormat(ns.getHackTime(targetHost))
        print(`[${sourceHost}] Expected hack time ${hackTime}.`)

        const money = await ns.hack(targetHost, { threads })
        print(`[${sourceHost}] Hacked ${targetHost} and acquired $${ns.formatNumber(money)}.`)

        if (args.once) {
            break
        }
    }
}
