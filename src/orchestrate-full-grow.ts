import { NS } from "@ns";
import { getPrintFunc, getPwndServers, getTargetedScriptArgs, shouldRunOnlyOnce } from "/util";

/**
 * Orders all pwned servers to use as much capacity as they can to weaken a single target.
 */
export async function main(ns: NS): Promise<void> {
    const args = getTargetedScriptArgs(ns)
    const print = getPrintFunc(ns)

    for (const hostname of getPwndServers(ns)) {
        const ram = ns.getServerMaxRam(hostname);
        const mem = ns.getScriptRam("grow.js", hostname);
        const threads = Math.floor(ram / mem);

        if (threads > 0) {
            const execArgs = [args.target, threads, "--silent"]
            if (shouldRunOnlyOnce(ns)) {
                execArgs.push("--once")
            }

            const pid = ns.exec("grow.js", hostname, { threads }, ...execArgs);
            print(`Started grow.js on ${hostname} with PID ${pid} with ${threads} threads.`)
        }
    }
}