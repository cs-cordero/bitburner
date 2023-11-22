import { NS } from "@ns"
import {
    formatMs,
    getPrintFunc,
    getPwndServers,
    getScanScriptArgs,
    waitUntilPidFinishes,
} from "/lib/util"

/**
 * Very early game dedicating 1000 threads to grow each server from the home server
 */
export async function main(ns: NS): Promise<void> {
    const args = getScanScriptArgs(ns)
    const print = getPrintFunc(ns)

    const hostsNeedMustering =
        args.targets ??
        getPwndServers(ns)
            .filter(
                (hostname) =>
                    ns.getServerSecurityLevel(hostname) <=
                    ns.getServerMinSecurityLevel(hostname) + 1
            )
            .filter(
                (hostname) =>
                    ns.getServerMoneyAvailable(hostname) <
                    ns.getServerMaxMoney(hostname)
            )
            .filter((hostname) => ns.getServerMaxMoney(hostname) > 0)
            .filter((hostname) => !hostname.startsWith("home"))

    const host = ns.getHostname()
    const free = ns.getServerMaxRam(host) - ns.getServerUsedRam(host)
    const memCost = ns.getScriptRam("grow.js", host)
    const threads = Math.floor(free / memCost)

    const threadsPerSapHost = Math.floor(threads / hostsNeedMustering.length)

    const additionalArgs = ["--once"]
    if (ns.args.includes("--silent")) {
        additionalArgs.push("--silent")
    }
    if (threadsPerSapHost > 0) {
        const pids = []
        for (const hostname of hostsNeedMustering) {
            const growTime = ns.getGrowTime(hostname)
            const pid = ns.run(
                "grow.js",
                { threads: threadsPerSapHost },
                hostname,
                threadsPerSapHost,
                ...additionalArgs
            )
            if (pid !== 0) {
                pids.push(pid)
                print(
                    `Mustering on ${hostname} PID ${pid} (${formatMs(
                        growTime
                    )})`
                )
            }
            await ns.sleep(100)
        }

        for (const pid of pids) {
            await waitUntilPidFinishes(ns, pid)
        }
    }

    await ns.sleep(10000)
}
