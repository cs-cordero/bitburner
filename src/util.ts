import { NS } from "@ns";

/**
 * Type guard for string
 */
export function isString(x: unknown): x is string {
    return typeof x === "string";
}

/**
 * Type guard for number
 */
export function isNumber(x: unknown): x is number {
    return typeof x === "number";
}


/**
 * Rounds a number to the nearest billion, million, or thousand, with two decimals and adding
 * the appropriate suffix (if any): b, m, k.
 */
export function formatNumber(x: number): string {
    const BILLION = 1_000_000_000;
    const MILLION = 1_000_000;
    const THOUSAND = 1_000;

    let rounded_number: number;
    let suffix: string;

    if (x >= BILLION) {
        rounded_number = Math.round(x / BILLION * 100) / 100;
        suffix = "b";
    } else if (x >= MILLION) {
        rounded_number = Math.round(x / MILLION * 100) / 100;
        suffix = "m";
    } else if (x >= THOUSAND) {
        rounded_number = Math.round(x / THOUSAND * 100) / 100;
        suffix = "k";
    } else {
        rounded_number = Math.round(x * 100) / 100;
        suffix = "";
    }

    return `$${rounded_number.toFixed(2)}${suffix}`;
}

/**
 * Given a percentage figure, typically between 0 to 100, rounds it to have 1 decimal point.
 * In other words, 74.3 percent should be provided to this function as 74.3, NOT 0.743.
 */
export function formatPct(x: number): string {
    return (Math.round(x * 10) / 10).toFixed(1);
}

/**
 * Rounds a number to some number of decimal points.
 * Note that it doesn't force any trailing 0s, if you want to print this somewhere, you'll
 * want to use .toFixed(n).
 */
export function round(x: number, decimalPoints: number): number {
    const adjustment = Math.pow(10, decimalPoints);
    return Math.round(x * adjustment) / adjustment;
}

/**
 * An allocation of threads to run grow or weaken for a given host.
 */
export interface GrowWeakenAllocation {
    hostname: string;
    growThreads: number;
    weakenThreads: number;
}

/**
 * Determines an optimal distribution of grow- and weaken threads per host.
 */
export function getOptimizedAllocation(ns: NS): GrowWeakenAllocation[] {
    const ramCostPerThread = 1.80;  // max(mem grow.js, mem weaken.js)
    const hostToMaxThreads: [string, number][] = [];
    for (const hostname of pwndServers) {
        hostToMaxThreads.push([hostname, Math.floor(ns.getServerMaxRam(hostname) / ramCostPerThread)])
    }

    hostToMaxThreads.sort((a, b) => b[1] - a[1])
    const totalThreads = hostToMaxThreads.reduce((prev, current) => prev + current[1], 0);

    let remainingGrowThreads = getNumberOfGrowThreads(totalThreads, 9);
    let remainingWeakenThreads = totalThreads - remainingGrowThreads;
    const allocation: GrowWeakenAllocation[] = []
    while (hostToMaxThreads.length) {
        const data = hostToMaxThreads.shift();
        if (data == undefined) {
            break;
        }

        const [hostname, hostThreads] = data;
        const growThreads = Math.min(hostThreads, remainingGrowThreads);
        const weakenThreads = Math.min(hostThreads - growThreads, remainingWeakenThreads);
        allocation.push({ hostname, growThreads, weakenThreads });
        remainingGrowThreads -= growThreads;
        remainingWeakenThreads -= weakenThreads;
    }

    return allocation
}

/**
 * Determines the number of grow threads allowed given the availableThreads count and a ratio of
 * grow threads per weaken.
 */
function getNumberOfGrowThreads(availableThreads: number, growThreadsPerWeaken: number): number {
    let growThreads = 0;
    while (availableThreads > 0) {
        availableThreads -= 1; // remove 1 for weaken thread.
        const growThreadAlloc = Math.min(growThreadsPerWeaken, availableThreads);
        growThreads += growThreadAlloc;
        availableThreads -= growThreadAlloc;
    }
    return growThreads
}

/**
 * Identifies all servers, excepting "home", that we have root access to.
 */
export function getPwndServers(ns: NS): string[] {
    const seen: Set<string> = new Set()
    seen.add("home");
    const queue: string[] = ["home"]

    const pwndServers = ns.getPurchasedServers()
    while (queue.length) {
        const hostname = queue.shift()!;
        for (const neighbor of ns.scan(hostname)) {
            if (seen.has(neighbor)) {
                continue;
            }
            seen.add(neighbor)
            queue.push(neighbor)
        }
        if (ns.hasRootAccess(hostname)) {
            pwndServers.push(hostname)
        }
    }

    return pwndServers
}

/**
 * Represents an allocation to run a script on a certain host with a certain number of threads.
 */
export interface ScriptThreadAllocation {
    hostname: string;
    scriptName: string;
    threads: number;
}

/**
 * Given the desire to run a particular script with a certain number of threads, this will scan
 * all pwnd servers and allocate as many threads as it can to each host until the given thread count is reached.
 */
export function allocateThreadsForScript(ns: NS, scriptName: string, neededThreads: number): ScriptThreadAllocation[] {
    const result = []
    const memCost = ns.getScriptRam(scriptName);

    let remainingThreadCount = neededThreads;
    for (const hostname of getPwndServers(ns)) {
        if (remainingThreadCount === 0) {
            break;
        }

        const maxRam = ns.getServerMaxRam(hostname)
        const usedRam = ns.getServerUsedRam(hostname)
        const freeRam = maxRam - usedRam;

        const allowableThreads = Math.floor(freeRam / memCost);
        const threads = Math.min(allowableThreads, remainingThreadCount);

        if (threads > 0) {
            result.push({ hostname, scriptName, threads })
            remainingThreadCount -= allowableThreads
        }
    }
    return result
}

/**
 * Determines the number of threads on a host running weaken() that would minimize the sec lvl in one cycle.
 */
export function getNumberOfWeakenThreadsNeeded(ns: NS, hostname: string): number {
    const current = ns.getServerSecurityLevel(hostname);
    const min = ns.getServerMinSecurityLevel(hostname);
    const decreasePerThread = 0.05; // game-defined
    const targetAmountToDecrease = current - min;

    return Math.ceil(targetAmountToDecrease / decreasePerThread);
}

/**
 * Given a PID, will wait second-by-second until it finishes.
 */
export async function waitUntilPidFinishes(ns: NS, pid: number): Promise<void> {
    let elapsedSeconds = 0;
    while (ns.isRunning(pid)) {
        ns.print(`Waiting for pid ${pid} to finish. Elapsed seconds ${elapsedSeconds}s`)
        await ns.sleep(1000);
        elapsedSeconds += 1;
    }
    ns.print(`Pid ${pid} completed after ${elapsedSeconds} seconds.`)
}

/**
 * A PID and hostname pair.
 */
export interface Process {
    pid: number;
    hostname: string;
}

/**
 * Given a list of Processes, will wait second-by-second until it finishes.
 */
export async function waitUntilProcessesFinishes(ns: NS, processes: Process[]): Promise<void> {
    let elapsedSeconds = 0;
    let remaining = [...processes];

    while (remaining.length) {
        ns.print(`Waiting for processes ${remaining} to finish. Elapsed seconds ${elapsedSeconds}s`)
        await ns.sleep(1000);
        remaining = remaining.filter(proc => ns.isRunning(proc.pid, proc.hostname))
        elapsedSeconds += 1;
    }
    ns.print(`Processes ${processes} completed after ${elapsedSeconds} seconds.`)
}

export function getPrintFunc(ns: NS): (arg: string) => void {
    return ns.args.includes("--silent") ? ns.print : ns.tprint;
}

/**
 * For scripts that reference a target, they must involve an arg at position 0 representing the target
 * and an arg at position 1 representing the number of threads.
 */
export interface TargetedScriptArgs {
    target: string;
    threads: number;
}

/**
 * Parses the script arguments for the {@link TargetedScriptArgs}.
 */
export function getTargetedScriptArgs(ns: NS): TargetedScriptArgs {
    const positionalArgs = ns.args.filter(arg => !isString(arg) || !arg.startsWith("--"));
    const target = positionalArgs[0];
    const threads = positionalArgs[1] ?? 1;
    const script = ns.getScriptName()

    if (!isString(target)) {
        throw Error(`Attempted to run targeted script ${script}, but had invalid value for hostname at position 0. Args: ${ns.args}`);
    }
    if (!isNumber(threads)) {
        throw Error(`Attempted to run targeted script ${script}, but had invalid value for threads at position 1. Args: ${ns.args}`);
    }

    return { target, threads }
}

/**
 * For scripts that perform a scan on multiple targets, they optionally may restrict the scan to a set of hostnames.
 */
export interface ScanScriptArgs {
    targets?: string[]
    printDetailedInfo: boolean
}

/**
 * Parses the script arguments for the {@link ScanScriptArgs}.
 */
export function getScanScriptArgs(ns: NS): ScanScriptArgs {
    const positionalArgs = ns.args
        .filter(arg => isString(arg) && !arg.startsWith("--")) as string[];

    const args: ScanScriptArgs = {
        printDetailedInfo: ns.args.includes("--detail")
    }
    if (positionalArgs.length) {
        args["targets"] = positionalArgs
    }

    return args
}

/**
 * Parses the script arguments for the presence of a flag that indicates a script should run only once.
 */
export function shouldRunOnlyOnce(ns: NS): boolean {
    return ns.args.includes("--once")
}