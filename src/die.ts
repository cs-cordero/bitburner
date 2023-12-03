import { NS } from "@ns"
import { EVERGREEN_SCRIPTS, waitUntilPidFinishes } from "/lib/util"

/**
 * Kills all the non-monitor scripts on the fleet and on home.
 */
export async function main(ns: NS): Promise<void> {
    const thisScript = ns.getRunningScript()!

    ns.ps()
        .filter((procInfo) => !EVERGREEN_SCRIPTS.includes(procInfo.filename))
        .filter((procInfo) => procInfo.pid !== thisScript.pid)
        .forEach((procInfo) => ns.kill(procInfo.pid))
    await waitUntilPidFinishes(ns, ns.run("fleet-killall.js"))
}
