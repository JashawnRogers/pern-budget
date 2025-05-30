import { redirect } from 'react-router-dom'
import { BASE_URL } from './auth'

// For Protecting routes
export const authLoader = async () => {
    try {
        const res = await fetch(`${BASE_URL}user/session`, {
            method: 'GET',
            credentials: 'include',
        })
        if (res.status === 200) {
            const data = await res.json()
            return {user: data.user}
        } else {
            return redirect('/')
        }
    } catch (error) {
        console.error('Error fetching session:', error);
        return redirect('/');
    }
}