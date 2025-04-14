import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

export const server = setupServer(
    http.post('/api/calculate', async ({ request }) => {
        const { operand1, operand2, operator } = await request.json()
        let result

        switch (operator) {
            case '+': result = operand1 + operand2; break
            case '-': result = operand1 - operand2; break
            case '*': result = operand1 * operand2; break
            case '/': result = operand1 / operand2; break
            default: return HttpResponse.json({ error: 'Invalid operator' }, { status: 400 })
        }

        return HttpResponse.json({ result })
    })
)