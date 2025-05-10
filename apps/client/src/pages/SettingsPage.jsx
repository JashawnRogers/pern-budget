import { useState } from 'react'
import Button from '../components/utils/Button'
import Modal from '../components/utils/Modal'
import { uploadProfilePic } from '../api/settings/settings'
import { useAuth } from '../api/auth/authContext'

const SettingsPage = () => {
    const [preview, setPreview] = useState(null)
    const [profileImage, setProfileImage] = useState(null)
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [deleteAccount, setDeleteAccount] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { user, setUser } = useAuth()

    const settingsCard = 'flex flex-col gap-4 w-full max-w-sm bg-white shadow-md p-6 rounded-xl border border-gray-200'
    const settingsInput = 'rounded-3xl h-10 w-full pl-4 border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'

    const closeModal = () => {
        setIsModalOpen(false)
    }

    const handleImageUpload = async (e) => {
        e.preventDefault()

       if (!profileImage) {
            setError('Please select an image first')
            return
       }

        try {
            const { user } = await uploadProfilePic(profileImage)
            setUser(user) // updating the user context
            alert('Profile image successfully updated')
            setPreview(null)
        } catch (error) {
            console.error(error)
            setError(error.message)
        }
    }

    const selectImage = (e) => {
        const file = e.target.files[0]
        if (file) {
            const fileURL = URL.createObjectURL(file)
            setProfileImage(file)
            setPreview(fileURL)
            setError('')
        } else {
            setPreview(null)
        }
    }

    const handlePasswordSubmit = (e) => {
        e.preventDefault()
        if (!password) return
        setIsModalOpen(true)
    }

    const handleConfirm = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError('Passwords do not match')
        }

        setError('')
        setIsModalOpen(false)
        alert('Password successfully changed')
        setPassword('')
        setConfirmPassword('')
    }

  return (
    <div className='min-h-screen bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6'>
        <h1 className='montesserat-400 text-5xl mb-12 text-center text-white'>Settings</h1>
        <div className='grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-8 max-w-6xl mx-auto'>
            
            {/* Upload Profile Picture */}
            <form className={`${settingsCard} md:row-span-2`} onSubmit={handleImageUpload}>
                <label htmlFor='profileImage' className='text-lg font-medium'>Upload Profile Picture:</label>
                <input 
                    type='file'
                    name='profileImage'
                    accept='image/*'
                    onChange={selectImage}
                    className={settingsInput}
                />

                {preview && (
                    <div className='w-64 h-64 rounded-full overflow-hidden mx-auto border-2 border-gray-300'>
                        <img src={preview} alt='Profile picture preview' className='w-full h-full object-cover' />
                    </div>
                )}

                <Button type='submit' className='w-full mt-2 bg-[#528265]! text-white'>Upload</Button>
            </form>
            
            {/* Change Profile Name */}
            <form className={settingsCard}>
                <label htmlFor='name' className='text-lg'>Change Profile Name:</label>
                <input 
                    type='text'
                    name='name'
                    value={name}
                    className={settingsInput}
                    onChange={(e) => setName(e.target.value)}
                />
                <Button type='submit' className='w-full mt-2 bg-[#528265]! text-white'>Change name</Button>
            </form>

            {/* Change Password */}
            <form onSubmit={handlePasswordSubmit} className={settingsCard}>
                <label htmlFor='password' className='text-lg'>Change Password:</label>
                <input 
                    type='password'
                    name='password'
                    value={password}
                    className={settingsInput}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type='submit' className='w-full mt-2 bg-[#528265]! text-white'>Change Password</Button>
            </form>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <form onSubmit={handleConfirm} className='flex flex-col gap-4 items-center p-4'>
                        <label htmlFor='confirmPassword' className='text-center'>Confirm New Password</label>
                        <input type='password'
                            name='confirmPassword'
                            placeholder = 'Re-enter new password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className={`${settingsInput} w-3/4`}
                        />
                        {error && <p className='text-red-500 text-sm'>{error}</p>}
                        <Button type='submit' className='bg-[#528265]! text-white w-1/2'>Confirm</Button>
                    </form>
                </Modal>
            )}

            {/* Delete Account */}
            <form className='flex flex-col gap-4 w-full bg-white shadow-md p-6 rounded-xl border border-gray-200 items-center md:col-span-2'>
                <p className="text-lg font-medium text-red-600 mb-2">Danger Zone</p>
                <p className="text-lg font-medium mb-2">Enter phrase: '<span className='font-bold'>I am super sure I am deleting my account.</span>'</p>
                <input 
                    type="text"
                    value={deleteAccount}
                    onChange={e => setDeleteAccount(e.target.value)}
                    className={settingsInput}
                />         
                <Button type='submit' className='!bg-red-500 text-white w-full'>Delete Account</Button>
            </form>

            {/* Change Email */}
            <form className={settingsCard}>
                <label htmlFor='email' className='text-lg'>Change email:</label>
                <input 
                    type='email'
                    name='email'
                    value={email}
                    className={settingsInput}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button type='submit' className='w-full mt-2 bg-[#528265]! text-white'>Change name</Button>
            </form>    
        </div>
    </div>
  )
}

export default SettingsPage