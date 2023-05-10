import { Container } from 'react-bootstrap'
import { HiOutlineArrowNarrowRight } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'

export default function ErrorPage() {
  const navigate = useNavigate()
  return (
    <div className='bgModal bgImage min-vh-100'>
      <Container className='py-5'>
        <div className='d-flex flex-column align-items-center align-items-lg-end mt-5'>
          <h1 className='text-danger error'>404</h1>
          <div className='cursor '>
            <p className=' fw-light'>
              The page you are looking for <br />
              might have been removed, <br />
              had its name changed, or is <br />
              temporarily unavailable.
            </p>
            <div
              className='d-flex gap-2 align-items-center'
              onClick={() => navigate('/')}
            >
              <span className='text-danger'>Go to homepage</span>
              <HiOutlineArrowNarrowRight size='1.5rem' color='red' />
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}