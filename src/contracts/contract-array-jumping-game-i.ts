import { NS } from "@ns";
import { arrayJumpingGameII } from "/src/contracts/contract-array-jumping-game-ii";

/**
 * Array Jumping Game I
 */
export function arrayJumpingGameI(ns: NS, input: any): string {
    return arrayJumpingGameII(ns, input) === "0" ? "0" : "1"
}