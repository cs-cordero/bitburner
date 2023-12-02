import { NS } from "@ns"
import { getPrintFunc, getPwndServers } from "/lib/util"

/**
 * Orders all pwnd servers to killall processes.  This excludes "home".
 */
export async function main(ns: NS): Promise<void> {
    const print = getPrintFunc(ns)

    print("Running killall on all pwnd servers")

    const pwndServers = getPwndServers(ns)
    for (const hostname of pwndServers) {
        ns.killall(hostname)
    }

    const failedServers = pwndServers.filter((server) => ns.getServerUsedRam(server) > 0)
    if (failedServers.length === 0) {
        print("Killall succeeded")
    } else {
        print("Killall failed")
    }
}
