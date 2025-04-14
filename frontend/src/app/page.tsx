'use client'

import { useState } from 'react'
import { createConnectTransport } from '@connectrpc/connect-web'
import { CalculatorService } from '@/gen/calculator/v1/calculator_connect'
import type { CalculateResponse } from '@/gen/calculator/v1/calculator_pb'
import {createPromiseClient} from "@connectrpc/connect";
import {CalculateRequest} from "@/gen/calculator/v1/calculator_pb";

export default function Calculator() {
    const [num1, setNum1] = useState('')
    const [num2, setNum2] = useState('')
    const [operator, setOperator] = useState('+')
    const [result, setResult] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const calculate = async () => {
        if (!num1 || !num2) {
            setError('请输入两个数字')
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operand1: parseFloat(num1),
                    operand2: parseFloat(num2),
                    operator
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            setResult(data.result)
            /*const transport = createConnectTransport({
                baseUrl: '/api',
                useBinaryFormat: true,
            })

            // noinspection TypeScriptValidateTypes
            const client = createPromiseClient(CalculatorService, transport)

            const response = await client.calculate(
                new CalculateRequest({
                    operand1: parseFloat(num1),
                    operand2: parseFloat(num2),
                    operator,
                })
            )*/

  /*          const res: CalculateResponse | {} = await client.calculate({
                operand1: parseFloat(num1),
                operand2: parseFloat(num2),
                operator,
            })*/

            //setResult(res.result)
        } catch (err) {
            setError(err instanceof Error ? err.message : '未知错误')
            console.error('RPC调用失败:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-6">RPC计算器</h1>

            <div className="space-y-4">
                <div>
                    <input
                        type="number"
                        value={num1}
                        onChange={(e) => setNum1(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="第一个数字"
                        disabled={loading}
                    />
                </div>

                <select
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    className="w-full p-2 border rounded"
                    disabled={loading}
                >
                    <option value="+">+ 加</option>
                    <option value="-">- 减</option>
                    <option value="*">× 乘</option>
                    <option value="/">÷ 除</option>
                </select>

                <div>
                    <input
                        type="number"
                        value={num2}
                        onChange={(e) => setNum2(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="第二个数字"
                        disabled={loading}
                    />
                </div>

                <button
                    onClick={calculate}
                    disabled={loading}
                    className={`w-full py-2 px-4 rounded text-white font-medium ${
                        loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {loading ? '计算中...' : '计算'}
                </button>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded">
                        {error}
                    </div>
                )}

                {result !== null && (
                    <div className="p-4 bg-green-50 rounded border border-green-200">
                        <h2 className="font-semibold mb-1">结果</h2>
                        <p className="text-2xl font-mono">
                            {num1} {operator} {num2} = {result}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}