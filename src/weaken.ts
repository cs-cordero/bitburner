import { NS } from "@ns"
import { getPrintFunc, getTargetedArgumentsOptionalThreads } from "/lib/util"

/**
 * Runs weaken() on a target server.
 */
export async function main(ns: NS): Promise<void> {
    const args = getTargetedArgumentsOptionalThreads(ns)
    const print = getPrintFunc(ns, args.silent)

    const sourceHost = ns.getHostname()
    const targetHost = args.target
    const threads = args.threads ?? 1
    while (true) {
        const weakenTime = ns.tFormat(ns.getWeakenTime(targetHost))
        print(`[${sourceHost}] Expected weaken time ${weakenTime}.`)

        const weakenAmount = await ns.weaken(targetHost, { threads })
        print(`[${sourceHost}] Weakened ${targetHost} by ${ns.formatNumber(weakenAmount, 3)} security level.`)

        if (args.once) {
            break
        }
    }
}
