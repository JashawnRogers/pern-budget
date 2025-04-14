export const BASE_URL = 'http://localhost:8001/api/budget'

export const createBudget = async ({ category, amount_limit }) => {
    try {
        const res = await fetch(`${BASE_URL}/create`, {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ category, amount_limit })
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || 'Login failed')
        }

        return await res.json()
    } catch (error) {
        throw new Error(error.message || 'Ran into issues creating new budget')
    }
}

export const getAllBudgets = async () => {
    try {
        const res = await fetch(`${BASE_URL}/get-all-budgets`, {
            method: 'GET',
            credentials: 'include',
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || 'Failed to fetch budgets')
        }

        const data = await res.json()
        return data.budgets
    } catch (error) {
        throw new Error(error.message || 'Server failed to fetch budgets')
    }
}