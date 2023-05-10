import { useEffect, useState } from 'react'
import { useStateContext } from '../config/context'
import { getUserProfile, updateUserProfile } from '../api/api'
import { format } from 'timeago.js'
import { useForm } from 'react-hook-form'
import registerOptions from '../utils/formValidation'
import { Button, Form } from 'react-bootstrap'
import { toast } from 'react-hot-toast'

export default function Profile() {
  const [profile, setProfile] = useState([])
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmiting] = useState(false)
  const { currentUser, logout } = useStateContext()
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${currentUser.token}`,
    },
  }
  useEffect(() => {
    window.document.title = profile?.name
    getUserProfile(currentUser._id, config)
      .then((res) => {
        setProfile(res.data)
      })
      .catch((error) => {
        console.log(error)
        setError(error)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser._id, currentUser.token, profile?.name])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async ({ name, email, password }, e) => {
    e.preventDefault()
    setIsSubmiting(true)
    try {
      const res = await updateUserProfile(
        { id: currentUser._id, name, email, password },
        config
      )
      if (res.status === 200) {
        toast.success('User profile updated successfully')
      }
      logout()
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
    setIsSubmiting(false)
  }

  return (
    <div className='p-2'>
      <p className='fs-5 mb-4 border-bottom'>Profile summary</p>
      <div className='border-bottom mb-4'>
        {error && <p>{error.message}</p>}
        <p className='fs-5'>
          <span>Username:</span> {profile.name}
        </p>
        <p className='fs-5'>
          <span>Email:</span> {profile.email}
        </p>
        <p className='fs-5'>
          <span>isAdmin:</span> {profile.isAdmin ? 'True' : 'False'}
        </p>
        <p className='fs-5'>
          <span>Registered:</span> {format(profile.createdAt)}
        </p>
      </div>
      <div>
        <p className='fs-5 mb-4'>Update your profile</p>
        <Form
          className='mt-4 mx-auto ms-lg-0'
          style={{ width: '270px' }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Form.Group controlId='formBasicName' className='mb-4'>
            <Form.Control
              type='text'
              placeholder='Username'
              className='mb-0 rounded-0'
              {...register('name', registerOptions.name)}
            />
            {errors?.name && (
              <span className='text-danger small'>{errors.name.message}</span>
            )}
          </Form.Group>
          <Form.Group controlId='formBasicEmail' className='mb-4'>
            <Form.Control
              type='email'
              placeholder='Email'
              className='mb-0 rounded-0'
              {...register('email', registerOptions.email)}
            />
            {errors?.email && (
              <span className='text-danger small'>{errors.email.message}</span>
            )}
          </Form.Group>
          <Form.Group controlId='formBasicPassword' className='mb-4'>
            <Form.Control
              type='password'
              placeholder='Password'
              className='mb-0 rounded-0'
              {...register('password', registerOptions.password)}
            />
            {errors?.password && (
              <span className='text-danger small'>
                {errors.password.message}
              </span>
            )}
          </Form.Group>
          <Button variant='dark' type='submit' className='rounded-0 w-100'>
            {isSubmitting ? ' Loading...' : 'UPDATE PROFILE'}
          </Button>
        </Form>
      </div>
    </div>
  )
}