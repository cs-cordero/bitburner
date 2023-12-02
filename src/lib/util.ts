import { NS } from "@ns"

/**
 * The prefix used when we purchase servers.
 */
export const PURCHASED_SERVER_PREFIX = "home"

export type ProcessId = number

/**
 * Type guard for string
 */
export function isString(x: unknown): x is string {
    return typeof x === "string"
}

/**
 * Type guard for string with assertion
 */
export function assertIsString(x: unknown): x is string {
    if (!isString(x)) {
        throw new Error(`Expected value to be string but was ${x}`)
    }

    return true
}

/**
 * Type guard for number
 */
export function isNumber(x: unknown): x is number {
    return typeof x === "number"
}

/**
 * Type guard for number with assertion
 */
export function assertIsNumber(x: unknown): x is number {
    if (!isNumber(x)) {
        throw new Error(`Expected value to be number but was ${x}`)
    }

    return true
}

/**
 * Exhaustive check helper
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function exhaustiveCheck(x: never): never {
    throw new Error("Should be unreachable")
}

/**
 * Rounds a number to the nearest billion, million, or thousand, with two decimals and adding
 * the appropriate suffix (if any): b, m, k.
 */
export function formatNumber(x: number, includeDollar?: boolean): string {
    const QUADRILLION = 1_000_000_000_000_000
    const TRILLION = 1_000_000_000_000
    const BILLION = 1_000_000_000
    const MILLION = 1_000_000
    const THOUSAND = 1_000

    let rounded_number: number
    let suffix: string

    if (x >= QUADRILLION) {
        rounded_number = Math.round((x / QUADRILLION) * 100) / 100
        suffix = "t"
    } else if (x >= TRILLION) {
        rounded_number = Math.round((x / TRILLION) * 100) / 100
        suffix = "t"
    } else if (x >= BILLION) {
        rounded_number = Math.round((x / BILLION) * 100) / 100
        suffix = "b"
    } else if (x >= MILLION) {
        rounded_number = Math.round((x / MILLION) * 100) / 100
        suffix = "m"
    } else if (x >= THOUSAND) {
        rounded_number = Math.round((x / THOUSAND) * 100) / 100
        suffix = "k"
    } else {
        rounded_number = Math.round(x * 100) / 100
        suffix = ""
    }

    const prefix = includeDollar ?? true ? "$" : ""

    return `${prefix}${rounded_number.toFixed(2)}${suffix}`
}

/**
 * Given a percentage figure, typically between 0 to 100, rounds it to have 1 decimal point.
 * In other words, 74.3 percent should be provided to this function as 74.3, NOT 0.743.
 */
export function formatPct(x: number): string {
    return (Math.round(x * 10) / 10).toFixed(1)
}

/**
 * Given a number of milliseconds, transform it into a human readable string.
 */
export function formatMs(x: number): string {
    let seconds = Math.floor(x / 1000)
    let minutes = Math.floor(x / 1000 / 60)
    const hours = Math.floor(x / 1000 / 60 / 60)
    if (hours > 0) {
        minutes %= 60
        seconds %= 60
        return `${hours}h ${minutes}m ${seconds}s`
    } else if (minutes > 0) {
        seconds %= 60
        return `${minutes}m ${seconds}s`
    } else {
        return `${seconds}s`
    }
}

/**
 * Rounds a number to some number of decimal points.
 * Note that it doesn't force any trailing 0s, if you want to print this somewhere, you'll
 * want to use .toFixed(n).
 */
export function round(x: number, decimalPoints: number): number {
    const adjustment = Math.pow(10, decimalPoints)
    return Math.round(x * adjustment) / adjustment
}

/**
 * Identifies all servers in the game, including home.
 */
export function getAllServers(ns: NS): string[] {
    const seen: Set<string> = new Set()
    seen.add("home")

    const queue: string[] = ["home"]
    while (queue.length) {
        const hostname = queue.shift()!
        for (const neighbor of ns.scan(hostname)) {
            if (seen.has(neighbor)) {
                continue
            }
            seen.add(neighbor)
            queue.push(neighbor)
        }
    }

    return [...seen.values()]
}

/**
 * Identifies all servers, excepting "home", that we have root access to.
 */
export function getPwndServers(ns: NS): string[] {
    return getAllServers(ns)
        .filter((hostname) => ns.hasRootAccess(hostname))
        .filter((hostname) => hostname !== "home")
}

/**
 * Get all hostnames belonging to servers in our fleet, upon which we can execute scripts.
 */
export function getFleetServers(ns: NS): string[] {
    return getAllServers(ns)
        .filter((hostname) => ns.hasRootAccess(hostname))
        .filter((hostname) => hostname !== "home")
}

/**
 * Get all hostnames belonging to servers that we do not own.
 * Avoids using ns.getPurchasedServers() to keep RAM usage low.
 */
export function getTargetableServers(ns: NS): string[] {
    return getFleetServers(ns).filter((hostname) => !hostname.startsWith(PURCHASED_SERVER_PREFIX))
}

/**
 * Given a PID, will wait second-by-second until it finishes.
 */
export async function waitUntilPidFinishes(ns: NS, pid: ProcessId): Promise<void> {
    if (pid === 0) {
        throw new Error("Pid was 0. It must have failed")
    }

    while (ns.isRunning(pid)) {
        await ns.sleep(1000)
    }
}

/**
 * Given a collection of PIDs, will wait second-by-second until they all finish.
 */
export async function waitUntilPidsFinish(ns: NS, pids: ProcessId[]): Promise<void> {
    for (const pid of pids) {
        await waitUntilPidFinishes(ns, pid)
    }
}

/**
 * A PID and hostname pair.
 */
export interface Process {
    pid: number
    hostname: string
    threads: number
    target?: string
}

export function getPrintFunc(ns: NS): (arg: any) => void {
    return ns.args.includes("--silent")
        ? ns.print
        : (msg: string) => {
              ns.tprint(msg)
              ns.print(msg)
          }
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
    const positionalArgs = ns.args.filter((arg) => isString(arg) && !arg.startsWith("--")) as string[]

    const args: ScanScriptArgs = {
        printDetailedInfo: ns.args.includes("--detail"),
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

/**
 * Returns whether the Formulas API is accessible to us.
 */
export function formulasApiActive(ns: NS): boolean {
    return ns.fileExists("Formulas.exe", "home")
}

/********************************************************************************************************************/
/** ARGUMENT PARSING METHODS AND TYPES */
/********************************************************************************************************************/

export enum PositionalArgType {
    String,
    Number,
    StringRest,
}

export interface PositionalArg {
    type: "POSITIONAL"
    position: number
    argType: PositionalArgType
    optional: boolean
}

export interface FlagArg {
    type: "FLAG"
}

export type ScriptArgumentSpec = PositionalArg | FlagArg
export type ScriptArgumentsSpec<ArgumentNames extends string> = Record<ArgumentNames, ScriptArgumentSpec>
export type ScriptArguments<ArgumentNames extends string> = Record<ArgumentNames, string | number | boolean | string[] | undefined>

export type TargetedScriptArgumentNames = "target" | "threads" | "once" | "silent"
export type FlagOnlyScriptArgumentNames = "once" | "silent" | "check"

export const TargetedScriptArgsSpec: ScriptArgumentsSpec<TargetedScriptArgumentNames> = {
    target: {
        type: "POSITIONAL",
        position: 0,
        argType: PositionalArgType.String,
        optional: false,
    },
    threads: {
        type: "POSITIONAL",
        position: 1,
        argType: PositionalArgType.Number,
        optional: false,
    },
    once: { type: "FLAG" },
    silent: { type: "FLAG" },
}

export const TargetedScriptArgsSpecOptionalThreads: ScriptArgumentsSpec<TargetedScriptArgumentNames> = {
    target: {
        type: "POSITIONAL",
        position: 0,
        argType: PositionalArgType.String,
        optional: false,
    },
    threads: {
        type: "POSITIONAL",
        position: 1,
        argType: PositionalArgType.Number,
        optional: true,
    },
    once: { type: "FLAG" },
    silent: { type: "FLAG" },
}

export interface TargetedScriptArgs extends ScriptArguments<TargetedScriptArgumentNames> {
    target: string
    threads: number
    once: boolean
    silent: boolean
}

export type TargetedScriptArgsOptionalThreads = Exclude<TargetedScriptArgs, "threads"> &
    Partial<Pick<TargetedScriptArgs, "threads">>

export const FlagOnlyArgsSpec: ScriptArgumentsSpec<FlagOnlyScriptArgumentNames> = {
    check: { type: "FLAG" },
    once: { type: "FLAG" },
    silent: { type: "FLAG" },
}

export interface FlagOnlyArgs extends ScriptArguments<FlagOnlyScriptArgumentNames> {
    check: boolean
    once: boolean
    silent: boolean
}

export function getTargetedArguments(ns: NS): TargetedScriptArgs {
    return parseArguments<TargetedScriptArgumentNames, typeof TargetedScriptArgsSpec, TargetedScriptArgs>(ns, TargetedScriptArgsSpec)
}

export function getTargetedArgumentsOptionalThreads(ns: NS): TargetedScriptArgsOptionalThreads {
    return parseArguments<TargetedScriptArgumentNames, typeof TargetedScriptArgsSpecOptionalThreads, TargetedScriptArgsOptionalThreads>(ns, TargetedScriptArgsSpecOptionalThreads)
}

export function getFlagOnlyArgs(ns: NS): FlagOnlyArgs {
    return parseArguments<FlagOnlyScriptArgumentNames, typeof FlagOnlyArgsSpec, FlagOnlyArgs>(ns, FlagOnlyArgsSpec)
}

export function parseArguments<
    T extends string,
    U extends ScriptArgumentsSpec<T>,
    V extends ScriptArguments<T>,
>(ns: NS, input: U): V {
    validatePositionalArguments(input)

    const parsedArguments: { [name: string]: string | number | boolean | string[] | undefined } = {}

    const positionalArgsSpec = Object.entries(input)
        .filter(([, spec]) => spec.type === "POSITIONAL")
        .map(([name, arg]) => [name, arg] as [string, PositionalArg])
    const providedPositionalArgs = ns.args.filter((arg) => !isString(arg) || !arg.startsWith("--"))

    positionalArgsSpec.forEach(([name, arg]) => {
        const rawProvided = providedPositionalArgs[arg.position]
        if (rawProvided === undefined) {
            if (arg.optional) {
                parsedArguments[name] = undefined
                return
            } else {
                throw new Error(`Invalid argument at position ${arg.position}: ${rawProvided}`)
            }
        }

        let argument: string | number | string[]
        switch (arg.argType) {
            case PositionalArgType.String:
                assertIsString(rawProvided)
                argument = rawProvided as string
                break
            case PositionalArgType.Number:
                assertIsNumber(rawProvided)
                argument = rawProvided as number
                break
            case PositionalArgType.StringRest:
                argument = providedPositionalArgs.slice(arg.position).map((arg) => arg.toString())
                break
            default:
                exhaustiveCheck(arg.argType)
        }
        parsedArguments[name] = argument
    })

    const flagArgs = Object.entries(input)
        .filter(([, spec]) => spec.type === "FLAG")
        .map(([name]) => name)
    flagArgs.forEach((arg) => (parsedArguments[arg] = ns.args.includes(`--${arg}`)))

    return parsedArguments as V
}

/**
 * Ensures the subset of arguments defined in the spec
 * @param input
 */
function validatePositionalArguments<T extends ScriptArgumentsSpec>(input: T) {
    const positionalArgsSpec = Object.values(input)
        .filter((arg) => arg.type === "POSITIONAL")
        .map((arg) => arg as PositionalArg)

    const positions = positionalArgsSpec.map((arg) => arg.position)

    const lowestPosition = positions.reduce((a, b) => Math.min(a, b))
    const highestPosition = positions.reduce((a, b) => Math.max(a, b))

    const restPositions = positionalArgsSpec.filter((arg) => arg.argType === PositionalArgType.StringRest)

    console.assert(positions.length === new Set(positions).size) // no dupes
    console.assert(lowestPosition === 0) // begins at 0
    console.assert(highestPosition === positions.length - 1) // contiguous
    console.assert(restPositions.length <= 1)
    console.assert(restPositions.length === 0 || restPositions[0].position === positions.length - 1)
}
