import { useState } from 'react'
import Button from '../components/utils/Button'
import Modal from '../components/utils/Modal'
import { uploadProfilePic, updateName, updatePassword, deleteUserAccount, updateEmail } from '../api/settings/settings'
import { useAuth } from '../api/auth/authContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const SettingsPage = () => {
    const [preview, setPreview] = useState(null)
    const [profileImage, setProfileImage] = useState(null)
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [email, setEmail] = useState('')
    const [deleteAccount, setDeleteAccount] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { user, setUser } = useAuth()

    const navigate = useNavigate()
    const passwordPhraseToDeleteAccount = 'I am super sure I am deleting my account.'

    const settingsCard = 'flex flex-col gap-4 w-full max-w-sm h-fit bg-white shadow-md p-6 rounded-xl border border-gray-200'
    const settingsInput = 'w-3/4 mx-auto rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#528265] focus:border-transparent'
    const submitButtonStyle = 'w-1/2 mx-auto my-4 py-2 !bg-[#528265] text-white rounded-lg text-lg font-semibold transition-colors'

    const closeModal = () => {
        setIsModalOpen(false)
    }

    const handleImageUpload = async (e) => {
        e.preventDefault()

       if (!profileImage) {
            toast.error('Please select an image first')
            return
       }

        try {
            const { user } = await toast.promise(
                uploadProfilePic(profileImage),
                {
                    loading: 'Loading...',
                    success: 'Profile image successfully updated!',
                    error: (error) => error.message || 'Something went wrong'
                }
            )
            setUser(user) // updating the user context
            setPreview(null)
        } catch (error) {
            console.log(error.error)
        }
    }

    const selectImage = (e) => {
        const file = e.target.files[0]
        if (file) {
            const fileURL = URL.createObjectURL(file)
            setProfileImage(file)
            setPreview(fileURL)
        } else {
            setPreview(null)
        }
    }

    const handleUpdateProfileName = async (e) => {
        e.preventDefault()

        if (!name) {
            toast.error('Please enter a name')
            return
        }

        if (name === user.name) {
            toast.error('Please provide a new name')
            return
        }

        try {
            const { user } = await toast.promise(
                updateName({ name }),
                {
                    loading: 'Loading...',
                    success: 'Profile name successfully updated!',
                    error: (error) => error.message || 'Something went wrong'
                }
            ) 
            setUser(user)
            setName('')
        } catch (error) {
            console.log(error.error)
        }
    }

    const handleUpdatePassword = (e) => {
        e.preventDefault()
        if (!password) {
            toast.error('Please enter a password')
            return
        }
        setIsModalOpen(true)
    }

    const handleConfirm = async (e) => {
        e.preventDefault()
        
        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        try {
            const { user } = await toast.promise(
                updatePassword({ password }),
                {
                    loading: 'Loading...',
                    success: 'Password successfully updated!',
                    error: (error) => error.message || 'Something went wrong'
                }
            )
            setUser(user)
            setIsModalOpen(false)
            setPassword('')
            setConfirmPassword('')
        } catch (error) {
            console.log(error.error)
        }
    }

    const handleDeleteAccount = async (e) => {
        e.preventDefault()

        if (deleteAccount.trim() !== passwordPhraseToDeleteAccount) {
            toast.error('Input does not match specified phrase')
            return
        }

        try {
            await toast.promise(
                deleteUserAccount(user.id),
                {
                    loading: 'Loading...',
                    success: 'Profile deleted successfully!',
                    error: (error) => error.message || 'Something went wrong'
                }
            )
            navigate('/')
        } catch (error) {
            console.log(error.error)
        }
    }

    const handleUpdateEmail = async (e) => {
        e.preventDefault()

        if (!email) {
            toast.error('Please provide a email')
            return
        }

        if (email === user.email) {
            toast.error('Please provide a new email')
            return
        }

        try {
            const { user } = await toast.promise(
                updateEmail({ email }),
                {
                    loading: 'Loading...',
                    success: 'Email successfully updated!',
                    error: (error) => error.message || 'Something went wrong'
                }
            )
            setUser(user)
            setEmail('')
        } catch (error) {
            console.log(error.error)
        }
    }

  return (
    <>
    <div className='min-h-screen bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6'>
        <h1 className='montesserat-400 text-5xl mb-12 text-center text-white'>Settings</h1>
        <div className='grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-8 max-w-6xl mx-auto'>
            
            {/* Upload Profile Picture */}
            <form className={`${settingsCard}`} onSubmit={handleImageUpload}>
                <label 
                    htmlFor='profileImage' 
                    className='text-lg font-medium'
                >
                    Upload Profile Picture:
                </label>
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

                <Button type='submit' className={submitButtonStyle}>Upload</Button>
            </form>
            
            {/* Change Profile Name */}
            <form className={settingsCard} onSubmit={handleUpdateProfileName}>
                <label htmlFor='name' className='text-lg'>Change Profile Name:</label>
                <input 
                    type='text'
                    name='name'
                    value={name}
                    className={settingsInput}
                    onChange={(e) => setName(e.target.value)}
                />
                <Button type='submit' className={submitButtonStyle}>Change name</Button>
            </form>

            {/* Change Password */}
            <form onSubmit={handleUpdatePassword} className={settingsCard}>
                <label htmlFor='password' className='text-lg'>Change Password:</label>
                <input 
                    type='password'
                    name='password'
                    value={password}
                    className={settingsInput}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type='submit' className={`${submitButtonStyle} !w-3/4`}>Change Password</Button>
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
                        <Button type='submit' className={submitButtonStyle}>Confirm</Button>
                    </form>
                </Modal>
            )}

            {/* Delete Account */}
            <form onSubmit={handleDeleteAccount} className='flex flex-col gap-4 w-full bg-white shadow-md p-6 rounded-xl border border-gray-200 items-center md:col-start-2 md:col-span-2'>
                <p className="text-lg font-medium text-red-600 mb-2">Danger Zone</p>
                <p className="text-lg font-medium mb-2">Enter phrase: '<span className='font-bold'>{passwordPhraseToDeleteAccount}</span>'</p>
                <input 
                    type="text"
                    value={deleteAccount}
                    onChange={e => setDeleteAccount(e.target.value)}
                    className={settingsInput}
                />         
                <Button type='submit' className={submitButtonStyle}>Delete Account</Button>
            </form>

            {/* Change Email */}
            <form className={`${settingsCard} md:col-start-1 md:row-start-2`} onSubmit={handleUpdateEmail}>
                <label htmlFor='email' className='text-lg'>Change email:</label>
                <input 
                    type='email'
                    name='email'
                    value={email}
                    className={settingsInput}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button type='submit' className={submitButtonStyle}>Change name</Button>
            </form>    
        </div>
    </div>
    </>
  )
}

export default SettingsPage