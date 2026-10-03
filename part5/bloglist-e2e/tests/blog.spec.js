const { test, expect, beforeEach, describe } = require('@playwright/test')
const { createBlog, loginWith } = require('./helper')

describe('Blog app updated', () => {
  beforeEach(async ({ page,request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
        await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen2',
        username: 'mluukkai2',
        password: 'salainen2'
      }
    })
        await page.goto('http://localhost:5173')
  })


  test("login",async({page})=>{
    await loginWith(page, 'mluukkai', 'salainen')
    await expect(page.getByText("login success")).toBeVisible()    
  })
    test("login fails",async({page})=>{
 await page.getByRole('link', { name: 'login' }).click()
  await page.getByLabel('username').fill("mluukkai")
  await page.getByLabel('password').fill("password")
  await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByText("wrong credentials")).toBeVisible()    
  })
  test("login user can create a blog", async({page})=>{
    await loginWith(page, 'mluukkai', 'salainen')
  await createBlog(page, 'Component testing', 'Test Author', 'https://react-testing-library.com')
  await expect(page.getByText('Component testing - Test Author')).toBeVisible()

})

  test("login user can press like", async({page})=>{
    await loginWith(page, 'mluukkai', 'salainen')
  await createBlog(page, 'Component testing', 'Test Author', 'https://react-testing-library.com')
  await page.getByText('Component testing - Test Author').click()
await page.getByRole('button', { name: 'like' }).click()
 await page.waitForResponse(response => response.url().includes('/api/blogs') && response.status() === 200)
await expect(page.getByText('1 likes')).toBeVisible()
})
  test("login user can remove the blog if you created", async({page})=>{
        page.on('dialog', async dialog => {
    await dialog.accept()
  })

    await loginWith(page, 'mluukkai', 'salainen')
  await createBlog(page, 'Component testing', 'Test Author', 'https://react-testing-library.com')
  await page.getByText('Component testing - Test Author').click()
await page.getByRole('button', { name: 'REMOVE' }).click()
 //await page.waitForResponse(response => response.url().includes('/api/blogs') && response.status() === 200)
  await expect(page.getByText('Component testing - Test Author')).not.toBeVisible()

})

  // })


  // test('Login form is shown', async ({ page }) => {
  // const locator = page.getByText('Blogs')
  // const loginButton = page.getByRole('button', { name: 'login' })

  //   await expect(locator).toBeVisible()
  //   await expect(loginButton).toBeVisible()
  //   })

  // test("user can log in", async({ page})=>{
  //   await page.goto('http://localhost:5173')
  //       await loginWith(page, 'mluukkai', 'salainen')

  //   await expect(page.getByText("mluukkai logged in")).toBeVisible()    
  // } )

  //   test("user can't log in with wrong credentials", async({ page})=>{
  //   await page.goto('http://localhost:5173')
  //       await loginWith(page, 'mluukkai', 'wrong')
  //   await expect(page.getByText("wrong credentials")).toBeVisible()    
  // } )


  // describe('When logged in', () => {
  // beforeEach(async ({ page }) => {
  //       await loginWith(page, 'mluukkai', 'salainen')
  // })

  // test('a new blog can be created', async ({ page }) => {

  //   const testTitle = 'Component testing'
  //   const testAuthor = 'Test Author'
  //   const testUrl = 'https://react-testing-library.com'

  //   await createBlog(page, testTitle,testAuthor,testUrl)
  //     await expect(page.getByText('Component testing Test Author')).toBeVisible()
  // })

//   describe('blog exist', () => {
//   beforeEach(async ({ page }) => {
//   await createBlog(page, 'Component testing', 'Test Author', 'https://react-testing-library.com')
//   })
//   test("Likes are visible", async({page})=>{

//     const blogElement = page.getByText("Component testing Test Author")
//     await blogElement.getByRole('button', { name: 'view' }).click()
//      await expect(page.getByText('likes')).toBeVisible()

//   })
//   test("Blog is deletable", async({page})=>{

//     page.on('dialog', async dialog => {
//     await dialog.accept()
//   })

//     const blogElement = page.getByText("Component testing Test Author")
//     await blogElement.getByRole('button', { name: 'view' }).click()
//     await page.getByRole('button', { name: 'remove' }).click()
//     await expect(blogElement).not.toBeVisible()

//   })
//   test("Blog is deletable only for the creater" , async({page})=>{
//     const blogElement = page.getByText("Component testing Test Author")
//     await page.getByRole('button', { name: 'logout' }).click()
//     await loginWith(page, 'mluukkai2', 'salainen2')
//     await blogElement.getByRole('button', { name: 'view' }).click()
//     await expect(blogElement.getByRole('button', { name: 'remove' })).not.toBeVisible()

    
//   })

//   test("Likes order is correct", async({page})=>{
//   await createBlog(page, 'it should be third', 'Test Author2', 'https://react-testing-library2.com')
//   await createBlog(page, 'it should be second', 'Test Author3', 'https://react-testing-library3.com')

// await page.locator('.blog').filter({ hasText: 'Component testing' }).getByRole('button', { name: 'view' }).click()  
// for (let i = 0; i < 8; i++) {
// await page.locator('.blog').filter({ hasText: 'Component testing' }).getByRole('button', { name: 'like' }).click()  
//  await page.waitForResponse(response => response.url().includes('/api/blogs') && response.status() === 200)
//   }
// await page.locator('.blog').filter({ hasText: 'it should be third' }).getByRole('button', { name: 'view' }).click()
// for (let i = 0; i < 4; i++) {
// await page.locator('.blog').filter({ hasText: 'it should be third' }).getByRole('button', { name: 'like' }).click()
//   await page.waitForResponse(response => response.url().includes('/api/blogs') && response.status() === 200)
//   }
// await page.locator('.blog').filter({ hasText: 'it should be second' }).getByRole('button', { name: 'view' }).click()

// for (let i = 0; i < 6; i++) {
// await page.locator('.blog').filter({ hasText: 'it should be second' }).getByRole('button', { name: 'like' }).click()
//     await page.waitForResponse(response => response.url().includes('/api/blogs') && response.status() === 200)
//   }

//   const blogTitles = await page.locator('.blog').allTextContents()
//   expect(blogTitles[0]).toContain('Component testing')
//   expect(blogTitles[1]).toContain('it should be second')
//   expect(blogTitles[2]).toContain('it should be third')
//   })

// })

  })



