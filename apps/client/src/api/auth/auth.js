export const BASE_URL = `${import.meta.env.VITE_API_URL}/api/`

export const login = async ({email, password}) => {
    try {
        const res = await fetch(`${BASE_URL}user/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || error.message || 'Login failed')
        }
    
        return res.json()
    } catch (error) {
        throw new Error(error.error || error.message ||'Server error - could not login')
    }
}

export const register = async ({name, email, password}) => {
    try {
        const res = await fetch(`${BASE_URL}user/register`, {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name, email, password})
        })
    
        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || error.message ||'Sign up failed')
        }
    
        return res.json()
    } catch (error) {
        throw new Error(error.error || error.message ||'Server error - could not register new account')
    }
}

export const logout = async () => {
    try {
        const res = await fetch(`${BASE_URL}user/logout`, {
            method: 'GET',
            credentials: 'include'
        })
    
        if (!res.ok) {
            const error = res.json()
            throw new Error(error.error || error.message ||'Logout failed')
        }
    
        return res.json()     
    } catch (error) {
        throw new Error(error.error || error.message ||'Server error - could not logout')
    }
}

export const getSession = async () => {
    try {
        const res = await fetch(`${BASE_URL}user/session`, {
            method: 'GET',
            credentials: 'include',
        })
    
        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || error.message ||'Session check failed')
        } 

        return res.json()
    } catch (error) {
        throw new Error(error.error || error.message ||'Server error - get user session')
    }

}