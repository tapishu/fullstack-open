import { render, screen } from '@testing-library/react'
//render: コンポーネントをテスト用の仮想画面（DOM）に描画するための関数です。
//screen: 描画された仮想画面の中から要素を探すためのオブジェクトです。
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'
const blog = {
  title: 'Component testing',
  author: 'Test Author',
  url: 'https://react-testing-library.com',
  likes: 5,
  user: {
    username: 'testuser',
    name: 'Test User'
  }
}

const blog2 = {
  title: 'Component second testing',
  author: 'Test second Author',
  url: 'https://react-testing-seconde-library.com',
  likes: 128,
  user: {
    username: 'testseconduser',
    name: 'Test Second User'
  }
}

// test('renders title and author, but does not render url or likes by default', async () => {

//  render(<Blog blog={blog} handleLike={vi.fn()} handleRemove={vi.fn()} currentUser={null} />)

// expect(screen.getByText(/Component testing/)).toBeDefined()
//   expect(screen.getByText(/Test Author/)).toBeDefined()
//   expect(screen.queryByText('https://react-testing-library.com')).toBeNull()
//   expect(screen.queryByText('likes: 5')).toBeNull()

// })

// test('renders url and likes after view', async () => {

//  render(<Blog blog={blog}/>)
//   const user = userEvent.setup()
//   const viewButton = screen.getByText("view")
//     await user.click(viewButton)

//     expect(screen.queryByText('https://react-testing-library.com')).toBeDefined()
//   expect(screen.queryByText('likes: 5')).toBeDefined()
// })

// // test('likes clicks twice', async () => {

// //handleLike 用のモック関数（ダミー関数）を作成
//   const mockHandler = vi.fn()
//   const user = userEvent.setup()
//  render(<Blog blog={blog} handleLike={mockHandler} />)
//   const viewButton = screen.getByText("view")
// await user.click(viewButton)
//   const likeButton = screen.getByText("like")
//   await user.click(likeButton)
//   await user.click(likeButton)

// expect(mockHandler.mock.calls).toHaveLength(2)

// })

test('Blog info and likes are visible but no remove,like button' , async() => {
  render(<Blog blog={blog} handleLike={vi.fn()} handleRemove={vi.fn()} currentUser={null} />)

  expect(screen.queryByText('https://react-testing-library.com')).toBeDefined()
  expect(screen.queryByText('likes: 5')).toBeDefined()
  expect(screen.queryByRole('button', { name: 'like' })).toBeNull()
  expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()

})

test('Only like bottun is visible if you are not a creater' , async() => {
  render(<Blog blog={blog} handleLike={vi.fn()} handleRemove={vi.fn()} currentUser={blog2.user} />)

  expect(screen.queryByText('https://react-testing-library.com')).toBeDefined()
  expect(screen.queryByText('likes: 5')).toBeDefined()
  expect(screen.getByRole('button', { name: 'like' })).toBeDefined()
  expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
})

test('both bottuns are visible if you are not a creater' , async() => {
  render(<Blog blog={blog} handleLike={vi.fn()} handleRemove={vi.fn()} currentUser={blog.user} />)

  expect(screen.queryByText('https://react-testing-library.com')).toBeDefined()
  expect(screen.queryByText('likes: 5')).toBeDefined()
  expect(screen.getByRole('button', { name: 'like' })).toBeDefined()
  expect(screen.getByRole('button', { name: 'remove' })).toBeDefined()

})