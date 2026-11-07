# Financier

A personal envelope-budgeting app: money is assigned to categories month by month, and transactions draw it down.

## Language

### Budgeting

**Master category**:
A named group of categories (e.g. "Housing"); the top level of the category hierarchy.
_Avoid_: Category group, parent category

**Category**:
An envelope money is budgeted to and spent from; belongs to exactly one master category.
_Avoid_: Envelope, subcategory

**Budgeted**:
The amount assigned to a category for one month. Only exists per whole month.
_Avoid_: Budget (that word means the whole budget project), allocation

**Outflow**:
The net amount moved through a category in a period: money out minus refunds and other inflows categorised there. Transfers and income are never outflow.
_Avoid_: Spending, expenses, activity

**Budget month**:
The month a transaction counts toward in the budget. It's normally the month of its date, but "income for next month" counts toward the following month.
_Avoid_: Transaction month, calendar month

**Uncategorised outflow**:
Outflow on on-budget accounts whose category is missing or has been deleted.
_Avoid_: Unassigned, orphaned

### Reports

**Report period**:
The span of whole budget months a report covers, so outflow and budgeted can be compared like for like.
_Avoid_: Date range, time frame
