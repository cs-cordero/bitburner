import { NS } from "@ns"

/**
 * Algorithmic Stock Trader I
 */
export function algorithmicStockTraderI(ns: NS, input: any): string {
    const prices = input as number[]

    let maxProfit = 0
    let buyPrice = 999999999999999
    for (const price of prices) {
        buyPrice = Math.min(price, buyPrice)
        maxProfit = Math.max(price - buyPrice, maxProfit)
    }
    return maxProfit.toString()
}
