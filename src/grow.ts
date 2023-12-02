import { NS } from "@ns"
import { getPrintFunc, getTargetedArgumentsOptionalThreads } from "/lib/util"

/**
 * Runs grow() on a target server.
 */
export async function main(ns: NS): Promise<void> {
    const args = getTargetedArgumentsOptionalThreads(ns)
    const print = getPrintFunc(ns, args.silent)

    const sourceHost = ns.getHostname()
    const targetHost = args.target
    const threads = args.threads ?? 1
    while (true) {
        const growTime = ns.tFormat(ns.getGrowTime(targetHost))
        print(`[${sourceHost}] Expected grow time ${growTime}.`)

        const growth = await ns.grow(targetHost, { threads })
        print(`[${sourceHost}] Grew ${targetHost} with effective increase of ${ns.formatNumber(growth, 3)}x.`)

        if (args.once) {
            break
        }
    }
}
