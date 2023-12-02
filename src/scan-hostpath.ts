import { NS } from "@ns"
import { findPathFromHome, getPrintFunc, getTargetedArgumentsOptionalThreads } from "/lib/util"

/**
 * Prints the server path to reach a target.
 */
export async function main(ns: NS): Promise<void> {
    const args = getTargetedArgumentsOptionalThreads(ns)
    const print = getPrintFunc(ns, args.silent)

    print(findPathFromHome(ns, args.target).join("->"))
}


