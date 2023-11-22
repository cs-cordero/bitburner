import { NS } from "@ns";
import { formatMs, getPrintFunc, getPwndServers, getTargetedScriptArgs, shouldRunOnlyOnce } from "/lib/util";

/**
 * Orders the fleet to grow() a single target.
 */
export async function main(ns: NS): Promise<void> {
    const args = getTargetedScriptArgs(ns)
    const print = getPrintFunc(ns)

    for (const hostname of getPwndServers(ns)) {
        const mem = ns.getScriptRam("grow.js", hostname);
        const maxRam = ns.getServerMaxRam(hostname);
        const usedRam = ns.getServerUsedRam(hostname);
        const ram = maxRam - usedRam
        const threads = Math.floor(ram / mem);

        if (threads > 0) {
            const execArgs = [args.target, threads, "--silent"]
            if (shouldRunOnlyOnce(ns)) {
                execArgs.push("--once")
            }

            const growTime = ns.getGrowTime(args.target)
            const pid = ns.exec("grow.js", hostname, { threads }, ...execArgs);
            if (pid !== 0) {
                print(`Started grow.js on ${hostname} with PID ${pid} with ${threads} threads. (${formatMs(growTime)})`)
            }
        }
    }
}