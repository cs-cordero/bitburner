import { NS } from "@ns"
import { waitUntilPidFinishes } from "/lib/util"

/**
 * Kills all the non-monitor scripts on the fleet and on home.
 */
export async function main(ns: NS): Promise<void> {
    const thisScript = ns.getRunningScript()!

    ns.ps()
        .filter((procInfo) => !procInfo.filename.startsWith("monitor"))
        .filter((procInfo) => procInfo.pid !== thisScript.pid)
        .forEach((procInfo) => ns.kill(procInfo.pid))
    await waitUntilPidFinishes(ns, ns.run("orchestrate-killall.js"))
}
