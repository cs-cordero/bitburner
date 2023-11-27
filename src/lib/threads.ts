import { NS } from "@ns";
import { formulasApiActive, getAllServers, getFleetServers, getPwndServers, ProcessId } from "/lib/util";

const CANONICAL_SCRIPT_LOCATION = "home"

/********************************************************************************************************************/
/** THREAD ANALYSIS METHODS */
/********************************************************************************************************************/

/**
 * Describes a manifest of thread counts either on the fleet or on home.
 */
interface ThreadManifest {
    manifestType: "FLEET" | "HOME"
    max: number
    free: number
    weaken: number
    grow: number
    hack: number
    share: number
    other: number
}

/**
 * Estimates the memory cost of the base scripts. This underlies most thread counting logic.
 */
export function getMemCost(ns: NS): number {
    const hackRam = ns.getScriptRam("hack.js", CANONICAL_SCRIPT_LOCATION)
    if (hackRam > 2) {
        ns.tprint(`WARNING: hack.js exceeds the expected RAM usage of 2GB: ${ns.formatRam(hackRam)}`)
    }

    const growRam = ns.getScriptRam("grow.js", CANONICAL_SCRIPT_LOCATION)
    if (growRam > 2) {
        ns.tprint(`WARNING: grow.js exceeds the expected RAM usage of 2GB: ${ns.formatRam(growRam)}`)
    }

    const weakRam = ns.getScriptRam("weaken.js", CANONICAL_SCRIPT_LOCATION)
    if (weakRam > 2) {
        ns.tprint(`WARNING: weak.js exceeds the expected RAM usage of 2GB: ${ns.formatRam(weakRam)}`)
    }

    return Math.max(hackRam, growRam, weakRam)
}

/**
 * Get the thread manifest from the home server.
 */
export function getHomeThreadManifest(ns: NS): ThreadManifest {
    return {
        manifestType: "HOME",
        ...getThreadManifest(ns, ["home"])
    }
}

/**
 * Get the thread manifest from across the fleet (rooted non-home servers).
 */
export function getFleetThreadManifest(ns: NS): ThreadManifest {
    return {
        manifestType: "FLEET",
        ...getThreadManifest(ns)
    }
}

/**
 * Analyzes the thread counts across some hosts.
 */
function getThreadManifest(ns: NS, hosts?: string[]): Omit<ThreadManifest, "manifestType"> {
    const memCost = getMemCost(ns)
    const servers = hosts ?? getPwndServers(ns)

    let max = 0
    let free = 0
    let weaken = 0
    let hack = 0
    let grow = 0
    let share = 0
    let other = 0
    for (const pwndServer of servers) {
        const maxRam = ns.getServerMaxRam(pwndServer)
        const usedRam = ns.getServerUsedRam(pwndServer)
        const freeRam = maxRam - usedRam
        max += Math.floor(maxRam / memCost)
        free += Math.floor(freeRam / memCost)

        for (const proc of ns.ps(pwndServer)) {
            if (proc.filename === "weaken.js") {
                weaken += proc.threads
            } else if (proc.filename === "grow.js") {
                grow += proc.threads
            } else if (proc.filename === "hack.js") {
                hack += proc.threads
            } else if (proc.filename === "share.js") {
                share += proc.threads
            } else {
                other += proc.threads
            }
        }
    }

    return { max, free, weaken, grow, hack, share, other }
}

/**
 * For a given host, this represents the count of hack(), grow(), and weaken() threads incoming from the entire
 * fleet + home targeting the given host.
 */
export interface IncomingThreadCounts {
    incomingGrow: number
    incomingHack: number
    incomingWeaken: number
}

/**
 * Returns the data from {@link countIncomingThreads} for a single host.
 */
export function countIncomingThreadsFor(ns: NS, targetedHost: string): IncomingThreadCounts {
    return countIncomingThreads(ns)[targetedHost] ?? { incomingGrow: 0, incomingHack: 0, incomingWeaken: 0 }
}

/**
 * Queries the processes across all servers and counts the number of hack(), grow(), and weaken() threads
 * targeting a particular host.
 */
export function countIncomingThreads(ns: NS): {[hostname: string]: IncomingThreadCounts} {
    const result: {[hostname: string]: IncomingThreadCounts} = {}

    getAllServers(ns)
        .filter(hostname => ns.hasRootAccess(hostname))
        .flatMap(hostname => ns.ps(hostname))
        .filter(procInfo => ["hack.js", "grow.js", "weaken.js"].includes(procInfo.filename))
        .forEach(procInfo => {
            const targetedHost = procInfo.args[0] as string
            if (result[targetedHost] === undefined) {
                result[targetedHost] = { incomingGrow: 0, incomingHack: 0, incomingWeaken: 0 }
            }

            const incomingCounts = result[targetedHost]
            if (procInfo.filename === "weaken.js") {
                incomingCounts.incomingWeaken += procInfo.threads
            } else if (procInfo.filename === "hack.js") {
                incomingCounts.incomingHack += procInfo.threads
            } else if (procInfo.filename === "grow.js") {
                incomingCounts.incomingGrow += procInfo.threads
            } else {
                throw new Error("Oops")
            }
        })

    return result
}

/********************************************************************************************************************/
/** THREAD EXECUTION METHODS */
/********************************************************************************************************************/

/**
 * Simple data holder that has grow threads and weaken threads that offset the security level increase from grow.
 */
export interface GrowWeakenThreads {
    growThreads: number
    weakenThreads: number
}

/**
 * Simple data holder that has hack threads and weaken threads that offset the security level increase from hack.
 */
export interface HackWeakenThreads {
    hackThreads: number
    weakenThreads: number
}

/**
 * For a given host, determine the number of weaken threads needed to bring the security level to its minimum value
 * in a single cycle. Also takes into account any in-progress hack() or grow() targeting the host.
 *
 * Depending on the timing of the weaken() threads relative to the hack() or grow() threads, this may not result in
 * a minimized security level.
 *
 * Hack threads increase security level by 0.002.
 * Grow threads increase security level by 0.004.
 * Weaken threads decrease security level by 0.05.
 */
export function estimateWeakenThreadToMinimize(ns: NS, hostname: string): number {
    const incomingThreads = countIncomingThreadsFor(ns, hostname)

    const currentSecurityLevel = ns.getServerSecurityLevel(hostname)
    const securityLevelFromHack = incomingThreads.incomingHack * 0.002
    const securityLevelFromGrow = incomingThreads.incomingGrow * 0.004
    const securityLevelFromWeaken = incomingThreads.incomingWeaken * 0.05

    const minSecurityLevel = ns.getServerMinSecurityLevel(hostname)
    const expectedSecurityLevel = currentSecurityLevel + securityLevelFromHack + securityLevelFromGrow - securityLevelFromWeaken
    const securityLevelToReduce = expectedSecurityLevel - minSecurityLevel
    return Math.ceil(securityLevelToReduce / 0.05)
}

/**
 * Given a desired total thread count, this estimates the maximum number of grow threads that can be executed
 * paired with a count of weaken threads that will remove the security level increase from the grow threads.
 *
 * Grow threads increase security level by 0.004.
 * Weaken threads decrease security level by 0.05.
 */
export function estimateGrowWeakenDistribution(ns: NS, totalThreads: number): GrowWeakenThreads {
    // 1.08 is the value determined after solving for G in the formula  T = G + (0.004G / 0.05) where T is
    // the constant desired thread count.
    const growThreads = Math.floor(totalThreads / 1.08)
    const weakenThreads = totalThreads - growThreads

    // test
    console.assert(weakenThreads * 0.05 >= growThreads * 0.004)

    return { growThreads, weakenThreads }
}

/**
 * Like {@link estimateGrowWeakenDistribution}, but empowered with the Formulas API.
 *
 * Grow threads increase security level by 0.004.
 * Weaken threads decrease security level by 0.05.
 */
export function estimateGrowWeakenDistributionSmart(ns: NS, target: string): GrowWeakenThreads {
    if (!formulasApiActive(ns)) {
        throw new Error("Smart functions require that the Formulas API be accessible")
    }

    const growThreads = Math.ceil(ns.formulas.hacking.growThreads(
        ns.getServer(target),
        ns.getPlayer(),
        ns.getServerMaxMoney(target),
        1
    ))

    return estimateWeakenOffsetForGrow(ns, growThreads)
}

/**
 * Given a desired total grow thread count, this estimates the number of weaken threads required to
 * offset the security level increase from the grow.
 *
 * Grow threads increase security level by 0.004.
 * Weaken threads decrease security level by 0.05.
 */
export function estimateWeakenOffsetForGrow(ns: NS, growThreads: number): GrowWeakenThreads {
    const increasedSecurityLevel = growThreads * 0.004
    const weakenThreads = Math.ceil(increasedSecurityLevel / 0.05)

    // test
    console.assert(weakenThreads * 0.05 >= growThreads * 0.004)

    return { growThreads, weakenThreads }
}

/**
 * Given a desired total thread count, this estimates the maximum number of hack threads that can be executed
 * paired with a count of weaken threads that will remove the security level increase from the grow threads.
 *
 * Hack threads increase security level by 0.002.
 * Weaken threads decrease security level by 0.05.
 */
export function estimateHackWeakenDistribution(ns: NS, totalThreads: number) {
    // 1.04 is the value determined after solving for G in the formula  T = H + (0.004H / 0.05) where T is
    // the constant desired thread count.
    const hackThreads = Math.floor(totalThreads / 1.04)
    const weakenThreads = totalThreads - hackThreads

    // test
    console.assert(weakenThreads * 0.05 >= hackThreads * 0.004)

    return { hackThreads, weakenThreads }
}

/**
 * Like {@link estimateHackWeakenDistribution}, but empowered with the Formulas API.
 *
 * Hack threads increase security level by 0.002.
 * Weaken threads decrease security level by 0.05.
 */
export function estimateHackWeakenDistributionSmart(ns: NS, target: string): HackWeakenThreads {
    if (!formulasApiActive(ns)) {
        throw new Error("Smart functions require that the Formulas API be accessible")
    }

    const hackPercent = ns.formulas.hacking.hackPercent(ns.getServer(target), ns.getPlayer())
    const hackThreads = Math.ceil(1 / hackPercent)

    return estimateWeakenOffsetForHack(ns, hackThreads)
}

/**
 * Given a desired total hack thread count, this estimates the number of weaken threads required to
 * offset the security level increase from the hack.
 *
 * Hack threads increase security level by 0.002.
 * Weaken threads decrease security level by 0.05.
 */
export function estimateWeakenOffsetForHack(ns: NS, hackThreads: number): HackWeakenThreads {
    const increasedSecurityLevel = hackThreads * 0.002
    const weakenThreads = Math.ceil(increasedSecurityLevel / 0.05)

    // test
    console.assert(weakenThreads * 0.05 >= hackThreads * 0.004)

    return { hackThreads, weakenThreads }
}

/**
 * Represents an allocation to run a script on a certain host with a certain number of threads.
 */
export interface ScriptThreadAllocation {
    hostname: string
    scriptName: string
    threads: number
}

/**
 * Given the desire to run a particular script with a certain number of threads, this will scan
 * all pwnd servers and allocate as many threads as it can to each host until the given thread count is reached.
 */
export function allocateFleetThreadsForScript(
    ns: NS,
    scriptName: "grow.js" | "weaken.js" | "hack.js",
    neededThreads: number
): ScriptThreadAllocation[] {
    if (neededThreads <= 0) {
        throw new Error(`Needed threads should be > 0: received ${neededThreads}`)
    }

    const memCost = getMemCost(ns)
    const hostnames = getFleetServers(ns).filter(hostname => ns.fileExists(scriptName, hostname))

    const result = []

    let remainingThreadCount = neededThreads
    for (const hostname of hostnames) {
        if (remainingThreadCount === 0) {
            break
        }

        const maxRam = ns.getServerMaxRam(hostname)
        const usedRam = ns.getServerUsedRam(hostname)
        const freeRam = maxRam - usedRam

        const allowableThreads = Math.floor(freeRam / memCost)
        const threads = Math.min(allowableThreads, remainingThreadCount)

        if (threads > 0) {
            result.push({ hostname, scriptName, threads })
            remainingThreadCount -= allowableThreads
        }
    }
    return result
}

/**
 * Executes the allocated ScriptThreadAllocations on the selected hosts, returning a list of process Ids.
 */
export function executeScriptThreadAllocations(ns: NS, target: string, allocations: ScriptThreadAllocation[]): ProcessId[] {
    const pids: ProcessId[] = []

    for (const allocation of allocations) {
        const pid = ns.exec(
            allocation.scriptName,
            allocation.hostname,
            { threads: allocation.threads },
            target, allocation.threads, "--silent", "--once"
        )

        if (pid === 0) {
            ns.tprint(`ERROR: Failed to execute ${allocation.scriptName} on ${allocation.hostname}!`)
            continue
        }

        pids.push(pid)
    }

    return pids
}