import { NS } from "@ns"

/**
 * Algorithmic Stock Trader IV
 */
export function algorithmicStockTraderIV(ns: NS, input: any): string {
    const [k, prices] = input as [number, number[]]

    const dp: number[] = new Array(prices.length).fill(0)
    for (let i = 0; i < k; i++) {
        // buy
        for (let n = 0; n < prices.length; n++) {
            if (n > 0) {
                dp[n] = Math.max(dp[n - 1], dp[n] - prices[n])
            } else {
                dp[n] = dp[n] - prices[n]
            }
        }

        // sell
        for (let n = 0; n < prices.length; n++) {
            if (n > 0) {
                dp[n] = Math.max(dp[n - 1], dp[n] + prices[n])
            } else {
                dp[n] = dp[n] + prices[n]
            }
        }
    }

    return dp[dp.length - 1].toString()
}
