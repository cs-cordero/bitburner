import { NS } from "@ns"
import { connectToServer, getFlagOnlyArgs, getPrintFunc } from "/lib/util"

/**
 * These are specific servers in the game that a player would be interested in installing a backdoor.
 */
const HOSTNAMES_OF_INTEREST = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z"]

/**
 * Backdoors specific servers for game progress.
 */
export async function main(ns: NS): Promise<void> {
    const originatingServer = ns.getHostname()
    ns.singularity.connect(originatingServer) // early test to check if singularity functions are enabled

    const args = getFlagOnlyArgs(ns)
    const print = getPrintFunc(ns, args.silent)

    const servers = HOSTNAMES_OF_INTEREST
        .map((hostname) => ns.getServer(hostname))
        .filter((server) => server.backdoorInstalled !== true)
        .filter((server) => ns.hasRootAccess(server.hostname))

    if (!servers.length) {
        print("No servers to backdoor!")
        return
    }

    for (const server of servers) {
        // traverse the network topology to reach target
        print(`Connecting to ${server.hostname}`)
        connectToServer(ns, server.hostname)

        // install the backdoor
        print(`Installing backdoor on ${server.hostname}`)
        await ns.singularity.installBackdoor()
    }

    // return to the server we ran this script from
    connectToServer(ns, originatingServer)
}
