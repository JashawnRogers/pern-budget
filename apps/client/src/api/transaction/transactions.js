const BASE_URL = 'http://localhost:8001/api/transactions'

export const getTransactions = async () => {
    try {
        const res = await fetch(`${BASE_URL}/get-transactions`, {
            method: 'GET',
            credentials: 'include'
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || error.message || 'Failed to fetch transactions')
        }

        const data = await res.json()
        return data.transactions
    } catch (error) {
        throw new Error(error.error || error.message || 'Server failed to fetch transactions')
    }
}

export const createTransaction = async ({amount, type, category, description, vendor, created_at}) => {
    try {
        const res = await fetch(`${BASE_URL}/create-transaction`, {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ amount, type, category, description, vendor, created_at })
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || error.message || 'Failed to create transaction')
        }

        const data = await res.json()
        console.log(data)
        return data
    } catch (error) {
        throw new Error(error.error || error.message || 'Server failed to create transaction')
    }
}

export const deleteTransaction = async (transaction_id) => {
    try {
        const res = await fetch(`${BASE_URL}/delete/${transaction_id}`, {
            method: 'DELETE',
            credentials: 'include'
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || error.message || 'Failed to delete transaction')
        }

        return await res.json()
    } catch (error) {
        throw new Error(error.error || error.message ||'Server failed to delete transaction')
    }
}

export const updateTransaction = async ({ amount, category, description, vendor, id }) => {
    try {
        const res = await fetch(`${BASE_URL}/update`, {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ amount, category, description, vendor, id })
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || error.message || 'Failed to update transaction')
        }

        return await res.json()
    } catch (error) {
        throw new Error(error.error || error.message ||'Server failed to update transaction')
    }
}