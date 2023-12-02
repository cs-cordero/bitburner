import { NS } from "@ns"
import { findPathFromHome } from "/scan-hostpath"
import { getTargetedScriptArgs } from "/lib/util"

/**
 * Backdoors specific servers for game progress.
 */
export async function main(ns: NS): Promise<void> {
    const args = getTargetedScriptArgs(ns, false)

    ns.tprint(`Connecting to ${args.target} from home`)
    ns.singularity.connect("home")
    for (const server of findPathFromHome(ns, args.target)) {
        ns.singularity.connect(server)
    }
    ns.tprint("Done")
}
