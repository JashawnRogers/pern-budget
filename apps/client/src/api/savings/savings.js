const BASE_URL = 'http://localhost:8001/api/savings'

export const createSavingsGoal = async ({ title, target_amount }) => {
    try {
        const res = await fetch(`${BASE_URL}/create`, {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ title, target_amount })
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.message || 'Bad request - could not create savings goal')
        }

        return await res.json()
    } catch (error) {
        throw new Error(error.message || 'Server error - could not create savings goal')
    }
}

export const updateSavingsGoal = async ({ title, target_amount, savings_id, add_to_current_amount }) => {
    try {
        const res = await fetch(`${BASE_URL}/update`, {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ title, target_amount, savings_id, add_to_current_amount })
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || 'Bad request - could not update savings goal')
        }

        return await res.json()
    } catch (error) {
        throw new Error(error.message  || 'Server error - could not update savings goal')
    }
}

export const deleteSavingsGoal = async ({ savings_id }) => {
    try {
        const res = await fetch(`${BASE_URL}/delete/${savings_id}`, {
            method: 'DELETE',
            credentials: 'include'
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.message || 'Bad request - could not savings goal')
        }
        return await res.json()
    } catch (error) {
        throw new Error(error.message || 'Server error - could not delete savings goal')
    }
}

export const getAllSavingsGoals = async () => {
    try {
        const res = await fetch(`${BASE_URL}/get-all-savings-goals`, {
            method: 'GET',
            credentials: 'include'
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.message || 'Bad request - could not retrieve savings goals')
        }

        return await res.json()
    } catch (error) {
        throw new Error(error.message || 'Server error - could not retrieve savings goals')
    }
}

export const getSavingsGoal = async ({ savings_id }) => {
    try {
        const res = await fetch(`${BASE_URL}/get-savings-goal/${savings_id}`, {
            method: 'GET',
            credentials: 'include'
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.message || 'Bad request - could not retrieve savings goal')
        }

        return await res.json()
    } catch (error) {
        throw new Error(error.message || 'Server error - could not retrieve savings goal')
    }
}