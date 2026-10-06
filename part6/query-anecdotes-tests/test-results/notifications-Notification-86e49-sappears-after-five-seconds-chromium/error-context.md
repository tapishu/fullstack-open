# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: notifications.spec.js >> Notifications (query-anecdotes) >> exercise 6.21: error handling for anecdotes that are too short >> the error notification also disappears after five seconds
- Location: tests/notifications.spec.js:101:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('notification')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByTestId('notification')

```

```yaml
- heading "Anecdote app" [level=3]
- heading "create new" [level=3]
- textbox
- button "create"
- text: Make it work, then make it fast has 0
- button "vote"
- text: There are two hard things in computer science has 3
- button "vote"
- text: Untested code is broken code has 3
- button "vote"
- text: Simplicity is the ultimate sophistication has 5
- button "vote"
- text: Real artists ship code has 7
- button "vote"
```

# Test source

```ts
  5   |   { content: "There are two hard things in computer science", votes: 3 },
  6   |   { content: "Untested code is broken code", votes: 3 },
  7   |   { content: "Simplicity is the ultimate sophistication", votes: 5 },
  8   |   { content: "Real artists ship code", votes: 7 },
  9   | ]
  10  | 
  11  | // Same reset strategy as anecdotes.spec.js: server.js keeps its data in
  12  | // memory and does not watch db-test.json for external changes, so the
  13  | // backend must be reset through its own API instead of by rewriting the
  14  | // file on disk.
  15  | const resetDb = async ({ request }) => {
  16  |   const response = await request.get("http://localhost:3001/anecdotes")
  17  |   const current = await response.json()
  18  | 
  19  |   for (const anecdote of current) {
  20  |     await request.delete(`http://localhost:3001/anecdotes/${anecdote.id}`)
  21  |   }
  22  | 
  23  |   for (const anecdote of initialAnecdotes) {
  24  |     const created = await request.post("http://localhost:3001/anecdotes", {
  25  |       data: { content: anecdote.content },
  26  |     })
  27  |     const { id } = await created.json()
  28  |     await request.put(`http://localhost:3001/anecdotes/${id}`, {
  29  |       data: { id, content: anecdote.content, votes: anecdote.votes },
  30  |     })
  31  |   }
  32  | }
  33  | 
  34  | const anecdoteItem = (page, content) => page.getByText(content, { exact: true }).locator("..")
  35  | 
  36  | const voteButtonFor = (page, content) => anecdoteItem(page, content).getByRole("button", { name: "vote" })
  37  | 
  38  | // Notification.jsx already renders its element with data-testid="notification"
  39  | // when it has something to show, so tests key off that rather than fixed text
  40  | // for "is a notification showing at all". Where the tests do check wording
  41  | // (e.g. /created/i, /voted/i, /too short/i) that's an assumption about the
  42  | // message content exercises 6.20/6.21 ask for - adjust the regexes to match
  43  | // whatever wording is implemented if it differs.
  44  | const notification = (page) => page.getByTestId("notification")
  45  | 
  46  | test.describe("Notifications (query-anecdotes)", () => {
  47  |   test.beforeEach(async ({ request, page }) => {
  48  |     await resetDb({ request })
  49  |     await page.goto("/")
  50  |     await expect(page.getByText(initialAnecdotes[0].content)).toBeVisible()
  51  |   })
  52  | 
  53  |   test("no notification is shown before anything is done", async ({ page }) => {
  54  |     await expect(notification(page)).toBeHidden()
  55  |   })
  56  | 
  57  |   test.describe("exercise 6.20: creating and voting show a notification", () => {
  58  |     test("creating a new anecdote shows a notification, which disappears after five seconds", async ({ page }) => {
  59  |       await page.locator('input[name="anecdote"]').fill("Freshly baked wisdom")
  60  |       await page.getByRole("button", { name: "create" }).click()
  61  | 
  62  |       await expect(notification(page)).toBeVisible()
  63  |       await expect(notification(page)).toContainText(/created/i)
  64  | 
  65  |       // Still visible well before the five second timeout...
  66  |       await page.waitForTimeout(4000)
  67  |       await expect(notification(page)).toBeVisible()
  68  | 
  69  |       // ...and gone shortly after it.
  70  |       await expect(notification(page)).toBeHidden({ timeout: 3000 })
  71  |     })
  72  | 
  73  |     test("voting for an anecdote shows a notification, which disappears after five seconds", async ({ page }) => {
  74  |       const content = "Make it work, then make it fast"
  75  | 
  76  |       await voteButtonFor(page, content).click()
  77  | 
  78  |       await expect(notification(page)).toBeVisible()
  79  |       await expect(notification(page)).toContainText(/voted/i)
  80  | 
  81  |       await page.waitForTimeout(4000)
  82  |       await expect(notification(page)).toBeVisible()
  83  | 
  84  |       await expect(notification(page)).toBeHidden({ timeout: 3000 })
  85  |     })
  86  |   })
  87  | 
  88  |   test.describe("exercise 6.21: error handling for anecdotes that are too short", () => {
  89  |     test("submitting an anecdote shorter than 5 characters shows an error notification", async ({ page }) => {
  90  |       await page.locator('input[name="anecdote"]').fill("hey")
  91  |       await page.getByRole("button", { name: "create" }).click()
  92  | 
  93  |       await expect(notification(page)).toBeVisible()
  94  |       // The server rejects the request with "too short anecdote, must have
  95  |       // length 5 or more" - the notification is expected to surface that.
  96  |       await expect(notification(page)).toContainText(/too short/i)
  97  | 
  98  |       await expect(page.getByText("hey", { exact: true })).not.toBeVisible()
  99  |     })
  100 | 
  101 |     test("the error notification also disappears after five seconds", async ({ page }) => {
  102 |       await page.locator('input[name="anecdote"]').fill("hey")
  103 |       await page.getByRole("button", { name: "create" }).click()
  104 | 
> 105 |       await expect(notification(page)).toBeVisible()
      |                                        ^ Error: expect(locator).toBeVisible() failed
  106 | 
  107 |       await page.waitForTimeout(4000)
  108 |       await expect(notification(page)).toBeVisible()
  109 | 
  110 |       await expect(notification(page)).toBeHidden({ timeout: 3000 })
  111 |     })
  112 |   })
  113 | })
  114 | 
```