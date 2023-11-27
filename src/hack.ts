import { NS } from "@ns"
import { formatMs, formatNumber, getPrintFunc, getTargetedScriptArgs, shouldRunOnlyOnce, } from "/lib/util"

/**
 * Runs hack() on a target server.
 */
export async function main(ns: NS): Promise<void> {
    const args = getTargetedScriptArgs(ns)
    const print = getPrintFunc(ns)

    while (true) {
        const hackTime = formatMs(ns.getHackTime(args.target))
        print(`[${ns.getHostname()}] Expected hack time ${hackTime}.`)
        const money = await ns.hack(args.target, { threads: args.threads })
        print(`[${ns.getHostname()}] Hacked ${args.target} and acquired ${formatNumber(money)}.`)

        if (shouldRunOnlyOnce(ns)) {
            break
        }
    }
}
