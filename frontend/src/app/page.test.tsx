import { render, screen } from '@testing-library/react'
import Page from './page'

describe('Calculator Page', () => {
    // 必须包含至少一个测试用例
    it('should render calculator title', () => {
        render(<Page />)

        // 基础渲染测试
        expect(screen.getByRole('heading', {
            name: /RPC计算器/i
        })).toBeInTheDocument()

        // 组件元素测试
        expect(screen.getByPlaceholderText('第一个数字')).toBeInTheDocument()
        expect(screen.getByRole('combobox')).toBeInTheDocument()
    })
})