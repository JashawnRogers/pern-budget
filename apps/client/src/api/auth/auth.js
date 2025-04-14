export const BASE_URL = 'http://localhost:8001/api/'

export const login = async ({email, password}) => {
    const res = await fetch(`${BASE_URL}user/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Login failed')
    }

    return res.json()
}

export const register = async ({name, email, password}) => {
    const res = await fetch(`${BASE_URL}user/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, email, password})
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Sign up failed')
    }

    return res.json()
}

export const logout = async () => {
    const res = await fetch(`${BASE_URL}user/logout`, {
        method: 'GET',
        credentials: 'include'
    })

    if (!res.ok) {
        const error = res.json()
        throw new Error(error.error || 'Logout failed')
    }

    return res.json()
}

export const getSession = async () => {
    const res = await fetch(`${BASE_URL}user/session`, {
        method: 'GET',
        credentials: 'include',
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Session check failed')
    }

    return res.json()
}