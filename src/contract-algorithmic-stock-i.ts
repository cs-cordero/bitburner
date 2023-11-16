import { NS } from "@ns";

/**
 * Algorithmic Stock Trader I
 *
 * You are given the following array of stock prices (which are numbers) where the i-th element
 * represents the stock price on day i:
 *
 * 45,5,147,172,91,172,172,188,22,135,127,34,4,198,7,36,62,6,89,149,143,195,50,6,97,156,67,99,154,198,12,158,188,23,30,30,58,16
 *
 * Determine the maximum possible profit you can earn using at most one transaction (i.e. you can only buy and
 * sell the stock once). If no profit can be made then the answer should be 0. Note that you have to buy the stock
 * before you can sell it
 */
export async function main(ns: NS): Promise<void> {
    const input = [45,5,147,172,91,172,172,188,22,135,127,34,4,198,7,36,62,6,89,149,143,195,50,6,97,156,67,99,154,198,12,158,188,23,30,30,58,16]

    let maxProfit = 0
    let buyPrice = 999999999999999
    for (const price of input) {
        buyPrice = Math.min(price, buyPrice)
        maxProfit = Math.max(price - buyPrice, maxProfit)
    }
    ns.tprint(maxProfit)
}