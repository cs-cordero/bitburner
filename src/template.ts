import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  ns.tprint("Hello Remote API!");
  ns.tprint(`1 Thread, 1 Core: ${ns.weakenAnalyze(1, 1)}`);
  ns.tprint(`1 Thread, 2 Core: ${ns.weakenAnalyze(1, 2)}`);
  ns.tprint(`1 Thread, 3 Core: ${ns.weakenAnalyze(1, 3)}`);
  ns.tprint(`2 Thread, 1 Core: ${ns.weakenAnalyze(2, 1)}`);
  ns.tprint(`2 Thread, 2 Core: ${ns.weakenAnalyze(2, 2)}`);
  ns.tprint(`2 Thread, 3 Core: ${ns.weakenAnalyze(2, 3)}`);
}