import { NS } from "@ns"
import { findPathFromHome } from "/scan-hostpath"
import { getPrintFunc } from "/lib/util"

/**
 * Backdoors specific servers for game progress.
 */
export async function main(ns: NS): Promise<void> {
    const print = getPrintFunc(ns)
    const servers = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z"]
        .map((hostname) => ns.getServer(hostname))
        .filter((server) => server.backdoorInstalled !== true)
        .filter((server) => ns.hasRootAccess(server.hostname))

    if (!servers.length) {
        print("No servers to backdoor!")
        return
    }

    for (const server of servers) {
        print("Connecting to home")
        ns.singularity.connect("home")
        findPathFromHome(ns, server.hostname).forEach((path) => {
            print(`Connecting to ${path}`)
            ns.singularity.connect(path)
        })
        print(`Installing backdoor on ${server.hostname}`)
        await ns.singularity.installBackdoor()
    }

    ns.singularity.connect("home")
}
