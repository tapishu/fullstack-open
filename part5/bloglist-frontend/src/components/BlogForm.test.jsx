import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('BlogForm updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)
  const titleInput = screen.getByLabelText('title:')
  const authorInput = screen.getByLabelText('author:')
  const urlInput = screen.getByLabelText('url:')
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'testingTitle')
  await user.type(authorInput, 'testing author')
  await user.type(urlInput, 'https://testurl.com')
  await user.click(sendButton)

  console.log('呼び出し履歴:', createBlog.mock.calls)
  console.log('第1引数のオブジェクト:', createBlog.mock.calls[0][0])

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testingTitle')
  expect(createBlog.mock.calls[0][0].author).toBe('testing author')
  expect(createBlog.mock.calls[0][0].url).toBe('https://testurl.com')

})