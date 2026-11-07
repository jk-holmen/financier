# Grilling: where the report's numbers come from

Type: grilling
Status: resolved
Blocked by:
Part of: [Spending by category](../map.md)

## Question

How does the report get **Budgeted** and **Outflow** per category for a report period? Should it reuse the budget's existing per-month figures (`Month` / `MonthCategory` caches, via `MonthManager`), or recompute them from transactions the way the net worth and heat map reports do?

Decide too:

- how split transactions, `incomeNextMonth`, and future-dated transactions are handled
- how a category with a positive net outflow in the period is detected and left out
- how hidden and deleted categories, and master-category membership, are resolved
- what the shape of the data handed to the chart is. The plugin wants flat rows `{ masterCategoryId, masterCategoryName, categoryId, categoryName, amount > 0 }`, grouped by id. Still open: integer cents or decimals? See the answer in [01](01-treemap-plugin.md).

## Answer

- **Source:** sum the budget's existing per-month figures, rather than recomputing from transactions: each month's per-category Outflow (`categoryCache[id].outflow`) and Budgeted (`categories[id].budget`), over the **budget months** in the report period. This way the report always agrees with the budget screen, which already handles splits (each split is counted, the parent isn't), income (never outflow, and `incomeNextMonth` shifted a month), and off-budget accounts (left out). Read months from the existing month list. **Don't call `MonthManager.getMonth`**, because it creates months as a side effect.
- **Future-dated transactions:** counted, matching the budget screen. The period label is plain **"This month"**, not "so far".
- **Hidden categories:** Financier has none. The charting decision to "include hidden categories" is dropped. A master category being *collapsed* on the budget screen is display-only and has no effect on the report.
- **Deleted or no category:** outflow whose category no longer exists, or which never had one, is shown as **one "Uncategorised" block** in its own group outside the master categories. That keeps map totals true.
- **Zero or negative totals:** after summing over the period, any category whose total is ≤ 0 is left out. This applies to **both** maps, so negative Budgeted amounts are covered.
- **Code shape:** a standalone calculation service, replacing the contents of the branch's `services/reports/treeMap.js`, with unit tests like `netWorth.spec.js`. It takes the months, categories, master categories, and report period, and returns the plugin's flat rows `{ masterCategoryId, masterCategoryName, categoryId, categoryName, amount }`. Amounts are positive integers in the smallest currency unit. Formatting happens only for display, via the existing `intCurrency` filter. The chart directive only draws.
