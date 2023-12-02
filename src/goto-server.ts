import { NS } from "@ns"
import { connectToServer, getPrintFunc, getTargetedArgumentsOptionalThreads } from "/lib/util"

/**
 * Traverses network topology to reach a target server.
 * Requires singularity functions to be enabled.
 */
export async function main(ns: NS): Promise<void> {
    const args = getTargetedArgumentsOptionalThreads(ns)
    const print = getPrintFunc(ns, args.silent)

    // early test to check that singularity functions are enabled.
    ns.singularity.connect(ns.getHostname())

    print(`Connecting to ${args.target}`)
    connectToServer(ns, args.target)
}
