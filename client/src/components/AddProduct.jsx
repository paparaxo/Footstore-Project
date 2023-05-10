import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { createNewProduct, uploadCloudinary } from '../api/api'
import { toast } from 'react-hot-toast'
import Spinner from '../utils/spinner'
import { useStateContext } from '../config/context'

export default function AddProduct() {
  const [show, setShow] = useState(false)
  const [images, setImages] = useState([])
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [price, setPrice] = useState('')
  const [extra, setExtra] = useState([])
  const [extraOptions, setExtraOptions] = useState()
  const [category, setCategory] = useState('')
  const [color, setColor] = useState('')
  const [brand, setBrand] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [loading, setLoading] = useState(false)
  const { currentUser } = useStateContext()

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleExtraInput = (e) => {
    setExtraOptions({ ...extraOptions, [e.target.name]: e.target.value })
  }

  const handleExtra = async () => {
    setExtra((prev) => [...prev, extraOptions])
  }

  const extraOp = extra.map((tt) => tt.text)

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${currentUser.token}`,
    },
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let arr = []
    try {
      for (let i = 0; i < images.length; i++) {
        const upload = await uploadCloudinary(images[i])
        console.log('iuii', upload.data.secure_url)
        const url = upload.data.secure_url
        arr.push(url)
      }
      const newProduct = {
        title,
        desc,
        price,
        category,
        extra: extraOp,
        color,
        brand,
        isFeatured,
        images: arr,
      }
      setLoading(true)
      await createNewProduct(newProduct, config)
      toast.success(`Product created successfully`)
      handleClose()
      window.location.reload()
    } catch (error) {
      console.log(error)
      toast.error(`There was a problem creating your product`)
    }
    setLoading(false)
  }

  return (
    <>
      <Button variant='dark' className='rounded-0' onClick={handleShow}>
        ADD PRODUCT
      </Button>
      <Modal show={show} onHide={handleClose} backdrop='static'>
        <Modal.Header closeButton>
          <Modal.Title onClick={handleClose}>
            Add new product to store
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <Spinner />
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId='formBasicTitle' className='mb-4'>
                <Form.Control
                  type='text'
                  placeholder='Title'
                  className='mb-0 rounded-0'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId='formBasicDesc' className='mb-4'>
                <Form.Control
                  type='text'
                  placeholder='Description'
                  className='mb-0 rounded-0'
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId='formBasicPrice' className='mb-4'>
                <Form.Control
                  type='number'
                  placeholder='Price'
                  className='mb-0 rounded-0'
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId='formBasicCategory' className='mb-4'>
                <Form.Control
                  type='text'
                  placeholder='Category'
                  className='mb-0 rounded-0'
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId='formBasicColor' className='mb-4'>
                <Form.Control
                  type='text'
                  placeholder='Color'
                  className='mb-0 rounded-0'
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId='formBasicBrand' className='mb-4'>
                <Form.Control
                  type='text'
                  placeholder='Brand'
                  className='mb-0 rounded-0'
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId='formBasicExtra' className='mb-4'>
                <div className='d-flex justify-content-between gap-4'>
                  <Form.Control
                    type='text'
                    placeholder='Extra'
                    name='text'
                    className='mb-0 rounded-0'
                    onChange={handleExtraInput}
                  />
                  <Button
                    variant='danger'
                    className='rounded-0'
                    onClick={handleExtra}
                  >
                    Add
                  </Button>
                </div>
                <div className='d-flex flex-column gap-2 flex-wrap'>
                  {extra.map((option, i) => (
                    <p key={i} className='text-start'>
                      {option.text}
                    </p>
                  ))}
                </div>
              </Form.Group>
              <div className='d-flex align-items-center gap-3 mb-3'>
                <span>isFeatured:</span>
                <Button
                  variant='danger'
                  className='rounded-0'
                  onClick={() => setIsFeatured(!isFeatured)}
                >
                  {isFeatured ? 'True' : 'False'}
                </Button>
              </div>
              <p className='mb-3'>Upload Images</p>
              <Form.Group controlId='formBasicImages' className='mb-4'>
                <Form.Control
                  type='file'
                  multiple={true}
                  className='mb-0 rounded-0'
                  onChange={(e) => setImages(e.target.files)}
                />
              </Form.Group>
              <Button className='rounded-0' variant='dark' type='submit'>
                UPLOAD
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}