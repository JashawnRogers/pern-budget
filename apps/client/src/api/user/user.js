const BASE_URL = 'http://localhost:8001/api/user'

export const updateMonthlyIncome = async ({monthly_income}) => {
    try {
        const res = await fetch(`${BASE_URL}/income/update`, {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({monthly_income})
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.message || 'Sorry, we could not update the monthly income. Something was wrong with your request.')
        }

        const data = await res.json()
        return data.monthly_income
    } catch (error) {
        throw new Error(error.message || 'Ran into issues updating monthly income on server.')
    }
}

export const getMonthlyIncome = async () => {
    try {
        const res = await fetch(`${BASE_URL}/income`, {
            method: 'GET',
            credentials: 'include'
        })

        if(!res.ok) {
            const error = await res.json()
            throw new Error(error.message || 'Sorry, we could not get the monthly budget. Something went wrong with your request')
        }

        const data = await res.json()
        return data.monthly_income
    } catch (error) {
        throw new Error(error.message || 'Ran into issues fetching monthly budget from server')
    }
}