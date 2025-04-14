
// noinspection TypeScriptValidateTypes

import { CalculatorService } from '@/gen/calculator/v1/calculator_connect'
import { NextResponse } from 'next/server'
import { createConnectTransport} from '@connectrpc/connect-web'
import {createPromiseClient} from "@connectrpc/connect";


const transport = createConnectTransport({
    baseUrl: process.env.BACKEND_URL || 'http://localhost:8080',
    httpVersion: '1.1' // 明确指定HTTP版本
})

export async function POST(req: Request) {
    try {
        // noinspection TypeScriptValidateTypes
        const client = createPromiseClient(CalculatorService, transport)
        const body = await req.json()
        const res = await client.calculate(body)
        return NextResponse.json(res)
    } catch (error) {
        console.error('API代理错误:', error)
        // noinspection TypeScriptValidateTypes
        return NextResponse.json(
            { error: '内部服务器错误' },
            { status: 500 }
        )
    }
}