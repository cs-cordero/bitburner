import { NS } from "@ns"

/**
 * The prefix used when we purchase servers.
 */
export const PURCHASED_SERVER_PREFIX = "fleet"

/**
 * Scripts that get started by start.js and won't be killed by die.js
 */
export const EVERGREEN_SCRIPTS = [
    "monitoring/monitor-home.js",
    "monitoring/monitor-fleet.js",
    "contracts.js",
    "sync.js"
]

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
 * Type guard for string or number with assertion
 */
export function assertIsStringOrNumber(x: unknown): x is string | number {
    if (!isNumber(x) && !isString(x)) {
        throw new Error(`Expected value to be string or number but was ${x}`)
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
 * Given a number of milliseconds, transform it into a human readable string.
 * Uses abbreviations, unlike ns.tFormat.
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

export function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrintFunc = (msg: any) => void

/**
 * Returns a function that can be used for printing.
 */
export function getPrintFunc(ns: NS, shouldBeSilent: boolean): PrintFunc {
    ns.disableLog("disableLog")
    ns.disableLog("sleep")
    ns.disableLog("scan")
    ns.disableLog("getServerUsedRam")
    ns.disableLog("getServerMaxRam")
    ns.disableLog("getServerMinSecurityLevel")
    ns.disableLog("getServerSecurityLevel")

    return shouldBeSilent
        ? ns.print
        : (msg) => {
              ns.tprint(msg)
              ns.print(msg)
          }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export enum AlignDirection {
    Left,
    Center,
    Right
}

export interface Column {
    displayName: string
    alignment?: AlignDirection
}

export function printTable<FieldName extends string>(
    records: Record<FieldName, string>[],
    headers: [FieldName, Column][],
    printFn: PrintFunc
) {
    const fieldNameToPadSize: { [key in FieldName]?: number} = {}

    for (const record of records) {
        for (const entry of Object.entries(record)) {
            const [fieldName, value] = entry as [FieldName, string]
            fieldNameToPadSize[fieldName] = Math.max(fieldNameToPadSize[fieldName] ?? 0, value.length)
        }
    }
    for (const [fieldName, column] of headers) {
        fieldNameToPadSize[fieldName] = Math.max(fieldNameToPadSize[fieldName] ?? 0, column.displayName.length)
    }

    const serializedRows = records
        .map(record => {
            const columnStrings: string[] = []
            for (const [fieldName, column] of headers) {
                if (column.alignment === AlignDirection.Left) {
                    columnStrings.push((record[fieldName] ?? "").padEnd(fieldNameToPadSize[fieldName] ?? 0))
                } else if (column.alignment === AlignDirection.Center) {
                    const value = record[fieldName] ?? ""
                    const totalWidth = fieldNameToPadSize[fieldName] ?? 0
                    const totalPad = totalWidth - value.length
                    const leftPad = Math.floor(totalPad / 2)

                    columnStrings.push(value.padStart(leftPad + value.length).padEnd(totalWidth))
                } else {
                    columnStrings.push((record[fieldName] ?? "").padStart(fieldNameToPadSize[fieldName] ?? 0))
                }
            }
            return `|${columnStrings.join("|")}|`
        })

    const headerRow = "|" + headers
        .map(([fieldName, column]) => {
            const value = column.displayName
            const totalWidth = fieldNameToPadSize[fieldName] ?? 0
            const totalPad = totalWidth - value.length
            const leftPad = Math.floor(totalPad / 2)

            return value.padStart(leftPad + value.length).padEnd(totalWidth)
        })
        .join("|") + "|"
    const headerBar = "=".repeat(headerRow.length)

    printFn(headerBar)
    printFn(headerRow)
    printFn(headerBar)
    serializedRows.forEach(row => printFn(row))
    printFn(headerBar)
    printFn(`${serializedRows.length} total rows`)
    printFn(headerBar)
}

/********************************************************************************************************************/
/** SERVER ACCESS HELPERS */
/********************************************************************************************************************/

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
 * Using the network topology, find the series of connections to reach a target server from the home server.
 */
export function findPathFromHome(ns: NS, target: string): string[] {
    const seen: Set<string> = new Set()
    seen.add("home")

    const queue: string[][] = [["home"]]
    while (queue.length) {
        const path = queue.shift()!
        const currentHost = path[path.length - 1]
        if (currentHost === target) {
            return path
        }
        for (const neighbor of ns.scan(currentHost)) {
            if (seen.has(neighbor)) {
                continue
            }
            seen.add(neighbor)
            queue.push([...path, neighbor])
        }
    }

    return []
}

/********************************************************************************************************************/
/** PROCESS HELPERS */
/********************************************************************************************************************/

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
 * Given a collection of Processes, will wait second-by-second until they all finish.
 */
export async function waitUntilProcsFinish(ns: NS, processes: Process[]): Promise<void> {
    for (const process of processes) {
        await waitUntilPidFinishes(ns, process.pid)
    }
}

/**
 * Uniquely identifies a process.
 */
export type ProcessId = number

/**
 * A PID and hostname pair.
 */
export interface Process {
    pid: ProcessId
    hostname: string
    threads: number
    target?: string
}

/**
 * Keeps track of a set of Processes can return a count of threads that are still running.
 * Run tick() consistently for this watcher to check when processes are running.
 */
export class ProcessWatcher {
    private ns: NS
    private processes: Set<Process>

    constructor(ns: NS) {
        this.ns = ns
        this.processes = new Set()
    }

    tick() {
        const completed = [...this.processes].filter(process => !this.ns.isRunning(process.pid))
        completed.forEach(process => this.processes.delete(process))
    }

    watch(...processes: Process[]) {
        for (const process of processes) {
            if (process.pid === 0 || !this.ns.isRunning(process.pid)) {
                continue
            }
            this.processes.add(process)
        }
    }

    threadsActive() {
        return [...this.processes].map(process => process.threads).reduce((a, b) => a + b, 0)
    }
}

/********************************************************************************************************************/
/** SINGULARITY HELPERS */
/********************************************************************************************************************/

/**
 * Traverses the network topology to reach a target server.
 * Requires singularity functions to be available.
 */
export function connectToServer(ns: NS, hostname: string) {
    // Perform a no-op singularity function call to test that singularity functions are enabled.
    // If they are not enabled, this will throw an error.
    ns.singularity.connect(ns.getHostname())

    ns.singularity.connect("home")
    findPathFromHome(ns, hostname).forEach(server => ns.singularity.connect(server))
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

export type SpecTypes = PositionalArg | FlagArg
export type ArgumentTypes = string | number | boolean | string[]

export type ScriptArgumentsSpec<
    RequiredNames extends string,
    OptionalNames extends string = never,
> = { [K in RequiredNames & OptionalNames]: SpecTypes }
export type ScriptArguments<
    RequiredNames extends string,
    OptionalNames extends string = never,
> = { [K in RequiredNames]: ArgumentTypes } & { [K in OptionalNames]?: ArgumentTypes }

/**
 * The low-level, pain in the ass, generic-type-filled argument parser.  Offers full control and full danger.
 * At the end, the value returned is ultimately casted as the Args type, so be careful not following that contract.
 */
export function parseArguments<
    Required extends string,
    Optional extends string = never,
    Spec extends ScriptArgumentsSpec<Required, Optional> = ScriptArgumentsSpec<Required, Optional>,
    Args extends ScriptArguments<Required, Optional> = ScriptArguments<Required, Optional>,
>(ns: NS, argsSpec: Spec): Args {
    const parsedArguments: { [name: string]: ArgumentTypes } = {}

    const positionalArgsSpec = Object.entries(argsSpec)
        .map(([name, spec]) => [name, spec] as [string, SpecTypes])
        .filter(([, spec]) => spec.type === "POSITIONAL")
        .map(([name, arg]) => [name, arg] as [string, PositionalArg])
    validatePositionalArguments(positionalArgsSpec)

    const providedPositionalArgs = ns.args
        .filter((arg) => !isString(arg) || !arg.startsWith("--"))
        .map((arg) => {
            assertIsStringOrNumber(arg)
            return arg as string | number
        })

    // process positional arguments based on the spec provided
    for (const [argName, arg] of positionalArgsSpec) {
        const rawProvided = providedPositionalArgs[arg.position]

        if (rawProvided === undefined) {
            if (arg.optional) {
                if (arg.argType === PositionalArgType.StringRest) {
                    parsedArguments[argName] = []
                }

                continue
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
        parsedArguments[argName] = argument
    }

    // process flag arguments based on the spec provided
    const flagArgs = Object.entries(argsSpec)
        .map(([name, spec]) => [name, spec] as [string, SpecTypes])
        .filter(([, spec]) => spec.type === "FLAG")
        .map(([name]) => name)
    flagArgs.forEach((argName) => (parsedArguments[argName] = ns.args.includes(`--${argName}`)))

    return parsedArguments as Args
}

/**
 * Ensures the subset of positional arguments defined in the spec maintain certain invariants.
 */
function validatePositionalArguments(positionalArgsSpecs: [string, PositionalArg][]) {
    if (!positionalArgsSpecs.length) {
        return
    }

    const specs = positionalArgsSpecs.map(([, arg]) => arg)

    const positions = specs.map((arg) => arg.position)

    const lowestPosition = positions.reduce((a, b) => Math.min(a, b))
    const highestPosition = positions.reduce((a, b) => Math.max(a, b))

    const restPositions = specs.filter((arg) => arg.argType === PositionalArgType.StringRest)

    console.assert(positions.length === new Set(positions).size) // no dupes
    console.assert(lowestPosition === 0) // begins at 0
    console.assert(highestPosition === positions.length - 1) // contiguous
    console.assert(restPositions.length <= 1)
    console.assert(restPositions.length === 0 || restPositions[0].position === positions.length - 1)
}

/********************************************************************************************************************/
/** CONCRETE ARGUMENT PARSING METHODS AND TYPES */
/********************************************************************************************************************/

/** SCRIPTS THAT REQUIRE A TARGET AND THREAD COUNT */
export type TargetedArgumentNames = "target" | "threads" | "once" | "silent"
export const TargetedScriptArgsSpec: ScriptArgumentsSpec<TargetedArgumentNames> = {
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
export interface TargetedScriptArgs extends ScriptArguments<TargetedArgumentNames> {
    target: string
    threads: number
    once: boolean
    silent: boolean
}
export function getTargetedArguments(ns: NS): TargetedScriptArgs {
    return parseArguments<
        TargetedArgumentNames,
        never,
        typeof TargetedScriptArgsSpec,
        TargetedScriptArgs
    >(ns, TargetedScriptArgsSpec)
}

/** SCRIPTS THAT REQUIRE A TARGET AND MAYBE A THREAD COUNT */
export type TargetedOptionalThreadsArgumentNamesRequired = "target" | "once" | "silent"
export type TargetedOptionalThreadsArgumentNamesOptional = "threads"
export const TargetedOptionalThreadsArgsSpec: ScriptArgumentsSpec<TargetedOptionalThreadsArgumentNamesRequired, TargetedOptionalThreadsArgumentNamesOptional> = {
    ...TargetedScriptArgsSpec,
    threads: {
        type: "POSITIONAL",
        position: 1,
        argType: PositionalArgType.Number,
        optional: true,
    },
}
export interface TargetedOptionalThreadsArgs extends ScriptArguments<TargetedOptionalThreadsArgumentNamesRequired, TargetedOptionalThreadsArgumentNamesOptional> {
    target: string
    threads?: number
    once: boolean
    silent: boolean
}
export function getTargetedArgumentsOptionalThreads(ns: NS): TargetedOptionalThreadsArgs {
    return parseArguments<
        TargetedOptionalThreadsArgumentNamesRequired,
        TargetedOptionalThreadsArgumentNamesOptional,
        typeof TargetedOptionalThreadsArgsSpec,
        TargetedOptionalThreadsArgs
    >(ns, TargetedOptionalThreadsArgsSpec)
}

/** SCRIPTS THAT REQUIRE NO POSITIONAL ARGUMENTS BUT MAY CHECK SOME FLAGS */
export type FlagOnlyScriptArgumentNames = "once" | "silent" | "check"
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
export function getFlagOnlyArgs(ns: NS): FlagOnlyArgs {
    return parseArguments<
        FlagOnlyScriptArgumentNames,
        never,
        typeof FlagOnlyArgsSpec,
        FlagOnlyArgs
    >(ns, FlagOnlyArgsSpec)
}

/** SCRIPTS THAT READ MULTIPLE POSITIONAL ARGUMENTS AS TARGETS */
export type MultiTargetArgumentNames = "once" | "silent" | "check"
export const MultiTargetArgsSpec: ScriptArgumentsSpec<FlagOnlyScriptArgumentNames> = {
    targets: {
        type: "POSITIONAL",
        position: 0,
        argType: PositionalArgType.StringRest,
        optional: true
    },
    once: { type: "FLAG" },
    silent: { type: "FLAG" },
}
export interface MultiTargetArgs extends ScriptArguments<FlagOnlyScriptArgumentNames> {
    targets: string[]
    once: boolean
    silent: boolean
}
export function getMultiTargetArgs(ns: NS): MultiTargetArgs {
    return parseArguments<
        MultiTargetArgumentNames,
        never,
        typeof MultiTargetArgsSpec,
        MultiTargetArgs
    >(ns, MultiTargetArgsSpec)
}