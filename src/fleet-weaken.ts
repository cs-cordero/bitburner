import { NS } from "@ns"
import {
    formatMs,
    getPrintFunc,
    getPwndServers,
    getTargetedScriptArgs,
    shouldRunOnlyOnce,
} from "/lib/util"

/**
 * Orders all pwned servers to use as much capacity as they can to weaken a single target.
 */
export async function main(ns: NS): Promise<void> {
    const args = getTargetedScriptArgs(ns)
    const print = getPrintFunc(ns)

    const pwndServers = getPwndServers(ns)
    if (ns.args.includes("--includeHome")) {
        pwndServers.push("home")
    }

    for (const hostname of pwndServers) {
        const ram = ns.getServerMaxRam(hostname)
        const mem = ns.getScriptRam("weaken.js", hostname)
        const threads = Math.floor(ram / mem)

        if (threads === Infinity) {
            throw new Error(
                `${ram} ${mem} ${threads} ${hostname}. Probably you need to sync.js`
            )
        }

        if (threads > 0) {
            const execArgs = [args.target, threads, "--silent"]
            if (shouldRunOnlyOnce(ns)) {
                execArgs.push("--once")
            }

            const weakenTime = ns.getWeakenTime(args.target)
            const pid = ns.exec("weaken.js", hostname, { threads }, ...execArgs)
            print(
                `Started weaken.js on ${hostname} with PID ${pid} with ${threads} threads. (${formatMs(
                    weakenTime
                )})`
            )
        }
    }
}
