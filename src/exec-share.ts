import { NS } from "@ns"
import { getPrintFunc, getTargetedArgumentsOptionalThreads } from "/lib/util"

/**
 * Executes share() on home or a purchased server.
 */
export async function main(ns: NS): Promise<void> {
    if (ns.args.includes("--check")) {
        // this value comes in the form of 1.42 which indicates a 42% increase in power.
        const sharePower = ns.getSharePower()
        const sharePowerAsPct = ns.formatNumber((sharePower - 1) * 100, 1)
        ns.tprint(`Share power is providing +${sharePowerAsPct}% increase in reputation gain.`)
        return
    }

    const args = getTargetedArgumentsOptionalThreads(ns)
    const print = getPrintFunc(ns, args.silent)

    const hostname = args.target
    if (!ns.getPurchasedServers().includes(hostname) && hostname !== "home") {
        throw new Error("share() can only be run on purchased servers or home")
    }

    const memCost = ns.getScriptRam("share.js", "home")
    const maxRam = ns.getServerMaxRam(hostname)
    const usedRam = ns.getServerUsedRam(hostname)
    const freeRam = maxRam - usedRam

    const threads = args.threads ?? Math.floor(freeRam / memCost)

    if (threads > 0) {
        ns.exec("share.js", args.target, { threads })
        print(`share() executed on ${args.target} with ${threads} threads.`)
    } else {
        print(`${args.target} does not have any available threads to execute share().`)
    }
}
