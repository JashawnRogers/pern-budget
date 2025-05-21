const BASE_URL = `${import.meta.env.VITE_API_URL}/api/user`

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
            throw new Error(error.error || error.message ||'Sorry, we could not update your profile picture. Something was wrong with your request.')
        }

        return await res.json()
    } catch (error) {
        throw new Error(error.error || error.message ||'Ran into issues updating your profile picture on server.')
    }
}

export const updateEmail = async ({ email }) => {
    try {
        const res = await fetch(`${BASE_URL}/update-email`, {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email })
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || error.message ||'Sorry, we could not update your email. Something was wrong with your request.')
        }

        const data = await res.json()
        return data
    } catch (error) {
        throw new Error(error.error || error.message ||'Ran into issues updating your email on server.')
    }
}

export const updatePassword = async ({ password }) => {
    try {
        const res = await fetch(`${BASE_URL}/update-password`, {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ password })
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || error.message ||'Sorry, we could not update your password. Something was wrong with your request.')
        }

        const data = await res.json()
        return data
    } catch (error) {
        throw new Error(error.error || error.message ||'Ran into issues updating your password on server.')
    }
}

export const updateName = async ({ name }) => {
    try {
        const res = await fetch(`${BASE_URL}/update-name`, {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ name })
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || error.message ||'Sorry, we could not update your profile name. Something was wrong with your request.')
        }

        const data = await res.json()
        return data
    } catch (error) {
        throw new Error(error.error || error.message ||'Ran into issues updating your profile name on server.')
    }
}

export const deleteUserAccount = async ({user_id}) => {
    try {
        const res = await fetch(`${BASE_URL}/delete/${user_id}`, {
            method: 'DELETE',
            credentials: 'include'
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || error.message ||'Sorry, we could not delete your profile. Something was wrong with your request.')
        }

        return await res.json()
    } catch (error) {
        throw new Error(error.error || error.message ||'Ran into issues deleting your profile on server.')
    }
}