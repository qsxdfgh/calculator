import '@testing-library/jest-dom'
import { server } from '@/mocks/server' // 使用正确的别名路径

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())