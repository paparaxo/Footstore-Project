import { useEffect, useState } from 'react'
import { useStateContext } from '../config/context'
import { deleteProduct, getAllProducts } from '../api/api'
import { Button, Image, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../utils/formatCurrency'
import AddProduct from '../components/AddProduct'
import { toast } from 'react-hot-toast'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [error, setError] = useState(null)
  const { currentUser } = useStateContext()

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${currentUser.token}`,
    },
  }

  useEffect(() => {
    getAllProducts()
      .then((res) => {
        setProducts(res.data)
      })
      .catch((error) => {
        console.log(error)
        setError(error.message)
      })
  }, [])

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id, config)
      toast.success('Product deleted successfully')
      setProducts(products.filter((product) => product._id !== id))
    } catch (error) {
      toast.error('Something went wrong')
      console.error(error)
    }
  }

  return (
    <div className='p-2'>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <span className='fs-6'>All Products</span>
        <AddProduct />
      </div>
      {error && <p>{error.message}</p>}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Title</th>
            <th>Price</th>
            <th>Delete</th>
          </tr>
        </thead>
        {products.map((product, i) => (
          <tbody key={i}>
            <tr>
              <td>{i}</td>
              <td>
                <Link to={`/product/${product.slug}`}>
                  <Image
                    src={product.images?.[0]}
                    alt={product.title}
                    loading='lazy'
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'contain',
                    }}
                  />
                </Link>
              </td>
              <td>{product.title}</td>
              <td>{formatCurrency(product.price)}</td>
              <td>
                <Button
                  variant='danger'
                  className='rounded-0'
                  onClick={() => handleDelete(product._id)}
                >
                  DELETE
                </Button>
              </td>
            </tr>
          </tbody>
        ))}
      </Table>
    </div>
  )
}