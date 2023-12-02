import { NS } from "@ns"
import { formatMs, getPrintFunc, getPwndServers, getTargetedScriptArgs, shouldRunOnlyOnce } from "/lib/util"

/**
 * Orders all pwned servers to use as much capacity as they can to hack a single target.
 */
export async function main(ns: NS): Promise<void> {
    const args = getTargetedScriptArgs(ns)
    const print = getPrintFunc(ns)

    for (const hostname of getPwndServers(ns)) {
        const mem = ns.getScriptRam("hack.js", hostname)
        const maxRam = ns.getServerMaxRam(hostname)
        const usedRam = ns.getServerUsedRam(hostname)
        const ram = maxRam - usedRam
        const threads = Math.floor(ram / mem)

        if (threads > 0) {
            const execArgs = [args.target, threads, "--silent"]
            if (shouldRunOnlyOnce(ns)) {
                execArgs.push("--once")
            }

            const hackTime = ns.getHackTime(args.target)
            const pid = ns.exec("hack.js", hostname, { threads }, ...execArgs)
            print(`Started hack.js on ${hostname} with PID ${pid} with ${threads} threads. (${formatMs(hackTime)})`)
        }
    }
}
