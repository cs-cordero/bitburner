import { NS } from "@ns"
import { getTargetedScriptArgs } from "/lib/util";

export async function main(ns: NS): Promise<void> {
    const args = getTargetedScriptArgs(ns)
    if (!ns.getPurchasedServers().includes(args.target) && args.target !== "home") {
        throw new Error("Share can only be run on purchased servers or home")
    }

    const memCost = ns.getScriptRam("share.js", "home")
    const maxRam = ns.getServerMaxRam(args.target)
    const usedRam = ns.getServerUsedRam(args.target)
    const freeRam = maxRam - usedRam
    const threads = Math.floor(freeRam / memCost)

    if (threads > 0) {
        ns.exec("share.js", args.target, { threads })
    }
}
