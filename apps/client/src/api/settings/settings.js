const BASE_URL = 'http://localhost:8001/api/user'

export const uploadProfilePic = async (file) => {
    const formData = new FormData()
    formData.append('profileImage', file) // 'profileImage' must match the field name used in multer in backend

    try {
        const res = await fetch(`${BASE_URL}/upload-profile-image`, {
            method: 'PUT',
            credentials: 'include',
            body: formData
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.message || 'Sorry, we could not update your profile picture. Something was wrong with your request.')
        }

        return await res.json()
    } catch (error) {
        throw new Error(error.message || 'Ran into issues updating your profile picture on server.')
    }
}

export const updateEmail = async ({user_id, email}) => {
    try {
        const res = await fetch(`${BASE_URL}/update-email`, {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user_id, email})
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.message || 'Sorry, we could not update your email. Something was wrong with your request.')
        }

        const data = await res.json()
        return data
    } catch (error) {
        throw new Error(error.message || 'Ran into issues updating your email on server.')
    }
}

export const updatePassword = async ({user_id, password}) => {
    try {
        const res = await fetch(`${BASE_URL}/update-password`, {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user_id, password})
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.message || 'Sorry, we could not update your password. Something was wrong with your request.')
        }

        const data = await res.json()
        return data
    } catch (error) {
        throw new Error(error.message || 'Ran into issues updating your password on server.')
    }
}

export const updateName = async ({user_id, name}) => {
    try {
        const res = await fetch(`${BASE_URL}/update-name`, {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user_id, name})
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.message || 'Sorry, we could not update your profile name. Something was wrong with your request.')
        }

        const data = await res.json()
        return data
    } catch (error) {
        throw new Error(error.message || 'Ran into issues updating your profile name on server.')
    }
}

export const deleteAccount = async ({user_id}) => {
    try {
        const res = await fetch(`${BASE_URL}/delete/${user_id}`, {
            method: 'DELETE',
            credentials: 'include'
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.message || 'Sorry, we could not delete your profile. Something was wrong with your request.')
        }

        return await res.json()
    } catch (error) {
        throw new Error(error.message || 'Ran into issues deleting your profile on server.')
    }
}