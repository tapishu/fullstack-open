const loginWith = async (page, username, password)  => {
  //await page.getByRole('button', { name: 'login' }).click()
  await page.getByRole('link', { name: 'LOGIN' }).click()

  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'LOGIN' }).click()
  await page.getByText(`login success`).waitFor({ state: 'visible' })
}

const createBlog = async (page, title,author,url) => {
 // await page.getByRole('button', { name: 'new blog' }).click()
   await page.getByRole('link', { name: 'NEW BLOG' }).click()
   await page.waitForURL('**/create') // ルーティングしている場合
await page.getByLabel('title:').fill(title)
  await page.getByLabel('author:').fill(author)
  await page.getByLabel('url:').fill(url)

const createButton = page.getByRole('button', { name: 'CREATE' })
await createButton.click({ force: true })

 await page.getByText(`a new blog ${title}`).waitFor({ state: 'visible' })

//await page.getByText(`${title} ${author}`).waitFor({ state: 'visible' }) 
}

  
  export { loginWith, createBlog }
