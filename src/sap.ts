import { NS } from "@ns"
import { formatMs, getPrintFunc, getPwndServers, getScanScriptArgs } from "/lib/util"

/**
 * Very early game dedicating 1000 threads to weaken each server from the home server
 * @param ns
 */
export async function main(ns: NS): Promise<void> {
    const args = getScanScriptArgs(ns)
    const print = getPrintFunc(ns)

    const hostsNeedSapping =
        args.targets ??
        getPwndServers(ns)
            .filter((hostname) => ns.getServerSecurityLevel(hostname) > ns.getServerMinSecurityLevel(hostname) + 1)
            .filter((hostname) => !hostname.startsWith("home"))

    const host = ns.getHostname()
    const free = ns.getServerMaxRam(host) - ns.getServerUsedRam(host)
    const memCost = ns.getScriptRam("weaken.js", host)
    const threads = Math.floor(free / memCost)

    const threadsPerSapHost = Math.floor(threads / hostsNeedSapping.length)

    const scriptArgs = ["--once"]
    if (ns.args.includes("--silent")) {
        scriptArgs.push("--silent")
    }

    for (const hostname of hostsNeedSapping) {
        const weakenTime = ns.getWeakenTime(hostname)
        const pid = ns.run("weaken.js", { threads: threadsPerSapHost }, hostname, threadsPerSapHost, ...scriptArgs)
        print(`Sapping from ${hostname} PID ${pid} (${formatMs(weakenTime)})`)
        await ns.sleep(100)
    }
}
