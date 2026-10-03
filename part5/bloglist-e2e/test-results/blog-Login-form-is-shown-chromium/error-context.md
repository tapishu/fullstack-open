# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: blog.spec.js >> Login form is shown
- Location: tests/blog.spec.js:69:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Blogs')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Blogs') with timeout 5000ms
  - waiting for getByText('Blogs')

```

# Test source

```ts
  1   | const { test, expect, beforeEach, describe } = require('@playwright/test')
  2   | const { createBlog, loginWith } = require('./helper')
  3   | 
  4   | describe('Blog app updated', () => {
  5   |   beforeEach(async ({ page,request }) => {
  6   |     await request.post('http://localhost:3003/api/testing/reset')
  7   |     await request.post('http://localhost:3003/api/users', {
  8   |       data: {
  9   |         name: 'Matti Luukkainen',
  10  |         username: 'mluukkai',
  11  |         password: 'salainen'
  12  |       }
  13  |     })
  14  |         await request.post('http://localhost:3003/api/users', {
  15  |       data: {
  16  |         name: 'Matti Luukkainen2',
  17  |         username: 'mluukkai2',
  18  |         password: 'salainen2'
  19  |       }
  20  |     })
  21  |         await page.goto('http://localhost:5173')
  22  |   })
  23  | 
  24  | 
  25  |   test("login",async({page})=>{
  26  |     await loginWith(page, 'mluukkai', 'salainen')
  27  |     await expect(page.getByText("login success")).toBeVisible()    
  28  |   })
  29  |     test("login fails",async({page})=>{
  30  |  await page.getByRole('link', { name: 'login' }).click()
  31  |   await page.getByLabel('username').fill("mluukkai")
  32  |   await page.getByLabel('password').fill("password")
  33  |   await page.getByRole('button', { name: 'login' }).click()
  34  | 
  35  |     await expect(page.getByText("wrong credentials")).toBeVisible()    
  36  |   })
  37  |   test("login user can create a blog", async({page})=>{
  38  |     await loginWith(page, 'mluukkai', 'salainen')
  39  |   await createBlog(page, 'Component testing', 'Test Author', 'https://react-testing-library.com')
  40  |   await expect(page.getByText('Component testing - Test Author')).toBeVisible()
  41  | 
  42  | })
  43  | 
  44  |   test("login user can press like", async({page})=>{
  45  |     await loginWith(page, 'mluukkai', 'salainen')
  46  |   await createBlog(page, 'Component testing', 'Test Author', 'https://react-testing-library.com')
  47  |   await page.getByText('Component testing - Test Author').click()
  48  | await page.getByRole('button', { name: 'like' }).click()
  49  |  await page.waitForResponse(response => response.url().includes('/api/blogs') && response.status() === 200)
  50  | await expect(page.getByText('1 likes')).toBeVisible()
  51  | })
  52  |   test("login user can remove the blog if you created", async({page})=>{
  53  |         page.on('dialog', async dialog => {
  54  |     await dialog.accept()
  55  |   })
  56  | 
  57  |     await loginWith(page, 'mluukkai', 'salainen')
  58  |   await createBlog(page, 'Component testing', 'Test Author', 'https://react-testing-library.com')
  59  |   await page.getByText('Component testing - Test Author').click()
  60  | await page.getByRole('button', { name: 'remove' }).click()
  61  |  //await page.waitForResponse(response => response.url().includes('/api/blogs') && response.status() === 200)
  62  |   await expect(page.getByText('Component testing - Test Author')).not.toBeVisible()
  63  | 
  64  | })
  65  | 
  66  |   })
  67  | 
  68  | 
  69  |   test('Login form is shown', async ({ page }) => {
  70  |   const locator = page.getByText('Blogs')
  71  |   const loginButton = page.getByRole('button', { name: 'login' })
  72  | 
> 73  |     await expect(locator).toBeVisible()
      |                           ^ Error: expect(locator).toBeVisible() failed
  74  |     await expect(loginButton).toBeVisible()
  75  |     })
  76  | 
  77  |   test("user can log in", async({ page})=>{
  78  |     await page.goto('http://localhost:5173')
  79  |         await loginWith(page, 'mluukkai', 'salainen')
  80  | 
  81  |     await expect(page.getByText("mluukkai logged in")).toBeVisible()    
  82  |   } )
  83  | 
  84  |     test("user can't log in with wrong credentials", async({ page})=>{
  85  |     await page.goto('http://localhost:5173')
  86  |         await loginWith(page, 'mluukkai', 'wrong')
  87  |     await expect(page.getByText("wrong credentials")).toBeVisible()    
  88  |   } )
  89  | 
  90  | 
  91  |   describe('When logged in', () => {
  92  |   beforeEach(async ({ page }) => {
  93  |         await loginWith(page, 'mluukkai', 'salainen')
  94  |   })
  95  | 
  96  |   test('a new blog can be created', async ({ page }) => {
  97  | 
  98  |     const testTitle = 'Component testing'
  99  |     const testAuthor = 'Test Author'
  100 |     const testUrl = 'https://react-testing-library.com'
  101 | 
  102 |     await createBlog(page, testTitle,testAuthor,testUrl)
  103 |       await expect(page.getByText('Component testing Test Author')).toBeVisible()
  104 |   })
  105 | 
  106 |   describe('blog exist', () => {
  107 |   beforeEach(async ({ page }) => {
  108 |   await createBlog(page, 'Component testing', 'Test Author', 'https://react-testing-library.com')
  109 |   })
  110 |   test("Likes are visible", async({page})=>{
  111 | 
  112 |     const blogElement = page.getByText("Component testing Test Author")
  113 |     await blogElement.getByRole('button', { name: 'view' }).click()
  114 |      await expect(page.getByText('likes')).toBeVisible()
  115 | 
  116 |   })
  117 |   test("Blog is deletable", async({page})=>{
  118 | 
  119 |     page.on('dialog', async dialog => {
  120 |     await dialog.accept()
  121 |   })
  122 | 
  123 |     const blogElement = page.getByText("Component testing Test Author")
  124 |     await blogElement.getByRole('button', { name: 'view' }).click()
  125 |     await page.getByRole('button', { name: 'remove' }).click()
  126 |     await expect(blogElement).not.toBeVisible()
  127 | 
  128 |   })
  129 |   test("Blog is deletable only for the creater" , async({page})=>{
  130 |     const blogElement = page.getByText("Component testing Test Author")
  131 |     await page.getByRole('button', { name: 'logout' }).click()
  132 |     await loginWith(page, 'mluukkai2', 'salainen2')
  133 |     await blogElement.getByRole('button', { name: 'view' }).click()
  134 |     await expect(blogElement.getByRole('button', { name: 'remove' })).not.toBeVisible()
  135 | 
  136 |     
  137 |   })
  138 | 
  139 |   test("Likes order is correct", async({page})=>{
  140 |   await createBlog(page, 'it should be third', 'Test Author2', 'https://react-testing-library2.com')
  141 |   await createBlog(page, 'it should be second', 'Test Author3', 'https://react-testing-library3.com')
  142 | 
  143 | await page.locator('.blog').filter({ hasText: 'Component testing' }).getByRole('button', { name: 'view' }).click()  
  144 | for (let i = 0; i < 8; i++) {
  145 | await page.locator('.blog').filter({ hasText: 'Component testing' }).getByRole('button', { name: 'like' }).click()  
  146 |  await page.waitForResponse(response => response.url().includes('/api/blogs') && response.status() === 200)
  147 |   }
  148 | await page.locator('.blog').filter({ hasText: 'it should be third' }).getByRole('button', { name: 'view' }).click()
  149 | for (let i = 0; i < 4; i++) {
  150 | await page.locator('.blog').filter({ hasText: 'it should be third' }).getByRole('button', { name: 'like' }).click()
  151 |   await page.waitForResponse(response => response.url().includes('/api/blogs') && response.status() === 200)
  152 |   }
  153 | await page.locator('.blog').filter({ hasText: 'it should be second' }).getByRole('button', { name: 'view' }).click()
  154 | 
  155 | for (let i = 0; i < 6; i++) {
  156 | await page.locator('.blog').filter({ hasText: 'it should be second' }).getByRole('button', { name: 'like' }).click()
  157 |     await page.waitForResponse(response => response.url().includes('/api/blogs') && response.status() === 200)
  158 |   }
  159 | 
  160 |   const blogTitles = await page.locator('.blog').allTextContents()
  161 |   expect(blogTitles[0]).toContain('Component testing')
  162 |   expect(blogTitles[1]).toContain('it should be second')
  163 |   expect(blogTitles[2]).toContain('it should be third')
  164 |   })
  165 | 
  166 | })
  167 | 
  168 |   })
  169 | 
  170 | 
  171 | 
  172 | 
```