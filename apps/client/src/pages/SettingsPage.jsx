import { useState } from 'react'
import Button from '../components/utils/Button'
import Modal from '../components/utils/Modal'
import {
  uploadProfilePic,
  updateName,
  updatePassword,
  deleteUserAccount,
  updateEmail,
} from '../api/settings/settings'
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

  const passwordPhraseToDeleteAccount =
    'I am super sure I am deleting my account.'

  const settingsCard =
    'flex flex-col gap-4 w-full bg-white shadow-md p-6 rounded-xl border border-gray-200'
  const settingsInput =
    'w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#528265] focus:border-transparent'
  const submitButtonStyle =
    'w-full sm:w-3/4 mx-auto my-2 py-2 !bg-[#528265] text-white rounded-lg text-lg font-semibold transition-colors'

  const closeModal = () => setIsModalOpen(false)

  const handleImageUpload = async (e) => {
    e.preventDefault()
    if (!profileImage) return toast.error('Please select an image first')

    try {
      const { user } = await toast.promise(uploadProfilePic(profileImage), {
        loading: 'Uploading...',
        success: 'Profile image updated!',
        error: (error) => error.message || 'Upload failed',
      })
      setUser(user)
      setPreview(null)
    } catch (error) {
      console.log(error.error)
    }
  }

  const selectImage = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
      setPreview(URL.createObjectURL(file))
    } else {
      setPreview(null)
    }
  }

  const handleUpdateProfileName = async (e) => {
    e.preventDefault()
    if (!name) return toast.error('Please enter a name')
    if (name === user.name) return toast.error('Please provide a new name')

    try {
      const { user } = await toast.promise(updateName({ name }), {
        loading: 'Updating...',
        success: 'Name updated!',
        error: (error) => error.message || 'Update failed',
      })
      setUser(user)
      setName('')
    } catch (error) {
      console.log(error.error)
    }
  }

  const handleUpdatePassword = (e) => {
    e.preventDefault()
    if (!password) return toast.error('Please enter a password')
    setIsModalOpen(true)
  }

  const handleConfirm = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword)
      return toast.error('Passwords do not match')

    try {
      const { user } = await toast.promise(updatePassword({ password }), {
        loading: 'Updating...',
        success: 'Password updated!',
        error: (error) => error.message || 'Update failed',
      })
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
      return toast.error('Input does not match the required phrase')
    }

    try {
      await toast.promise(deleteUserAccount(user.id), {
        loading: 'Deleting...',
        success: 'Account deleted!',
        error: (error) => error.message || 'Deletion failed',
      })
      navigate('/')
    } catch (error) {
      console.log(error.error)
    }
  }

  const handleUpdateEmail = async (e) => {
    e.preventDefault()
    if (!email) return toast.error('Please provide an email')
    if (email === user.email) return toast.error('Please enter a new email')

    try {
      const { user } = await toast.promise(updateEmail({ email }), {
        loading: 'Updating...',
        success: 'Email updated!',
        error: (error) => error.message || 'Update failed',
      })
      setUser(user)
      setEmail('')
    } catch (error) {
      console.log(error.error)
    }
  }

  return (
    <>
      <div className='min-h-screen bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6'>
        <h1 className='montesserat-400 text-4xl sm:text-5xl mb-10 text-center text-white'>
          Settings
        </h1>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto'>
          {/* Profile Picture Upload - Row 1, Col 1 */}
          <form
            className={`${settingsCard} lg:col-start-1 lg:row-start-1`}
            onSubmit={handleImageUpload}
          >
            <label htmlFor='profileImage' className='text-lg font-medium'>
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
              <div className='w-full aspect-square max-w-xs rounded-full overflow-hidden mx-auto border-2 border-gray-300'>
                <img
                  src={preview}
                  alt='Profile preview'
                  className='w-full h-full object-cover'
                />
              </div>
            )}
            <Button type='submit' className={submitButtonStyle}>
              Upload
            </Button>
          </form>

          {/* Change Email - Row 1, Col 2 */}
          <form
            className={`${settingsCard} lg:col-start-2 lg:row-start-1`}
            onSubmit={handleUpdateEmail}
          >
            <label htmlFor='email' className='text-lg'>
              Change Email:
            </label>
            <input
              type='email'
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={settingsInput}
            />
            <Button type='submit' className={submitButtonStyle}>
              Change Email
            </Button>
          </form>

          {/* Change Name - Row 2, Col 1 */}
          <form
            className={`${settingsCard} lg:col-start-1 lg:row-start-2`}
            onSubmit={handleUpdateProfileName}
          >
            <label htmlFor='name' className='text-lg'>
              Change Profile Name:
            </label>
            <input
              type='text'
              name='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={settingsInput}
            />
            <Button type='submit' className={submitButtonStyle}>
              Change Name
            </Button>
          </form>

          {/* Delete Account - Row 2, Col 2 */}
          <form
            onSubmit={handleDeleteAccount}
            className={`${settingsCard} lg:col-start-2 lg:col-span-2 lg:row-start-2 items-center`}
          >
            <p className='text-lg font-medium text-red-600 mb-2'>Danger Zone</p>
            <p className='text-center mb-2 text-sm sm:text-base'>
              Type '
              <span className='font-bold'>{passwordPhraseToDeleteAccount}</span>
              ' to confirm account deletion
            </p>
            <input
              type='text'
              value={deleteAccount}
              onChange={(e) => setDeleteAccount(e.target.value)}
              className={settingsInput}
            />
            <Button type='submit' className={submitButtonStyle}>
              Delete Account
            </Button>
          </form>

          {/* Change Password - Row 3, Col 1 */}
          <form
            className={`${settingsCard} lg:col-start-3 lg:row-start-1`}
            onSubmit={handleUpdatePassword}
          >
            <label htmlFor='password' className='text-lg'>
              Change Password:
            </label>
            <input
              type='password'
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={settingsInput}
            />
            <Button type='submit' className={submitButtonStyle}>
              Change Password
            </Button>
          </form>
        </div>

        {/* Modal for confirming password */}
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <form
              onSubmit={handleConfirm}
              className='flex flex-col gap-4 items-center p-4'
            >
              <label htmlFor='confirmPassword' className='text-center'>
                Confirm New Password
              </label>
              <input
                type='password'
                name='confirmPassword'
                placeholder='Re-enter new password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={settingsInput}
              />
              <Button type='submit' className={submitButtonStyle}>
                Confirm
              </Button>
            </form>
          </Modal>
        )}
      </div>
    </>
  )
}

export default SettingsPage
