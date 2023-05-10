import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getProductsByCategory } from "../api/api";
import Productcard from "../components/Productcard";
import Spinner from "../utils/spinner";

export default function Products() {
  const { name } = useParams()
  const [products, setProducts] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    window.document.title = name
    getProductsByCategory(name)
      .then((res) => {
        setProducts(res.data)
      })
      .catch((error) => {
        console.log(error)
        setError(error)
      })
  }, [name])

  if (!products) return <Spinner />

  return (
    <Container className='mt-5 py-5'>
      <div className='border border-danger px-2 logo-width'>
        <p className='texting mb-0'>Footshop</p>
        <h1 className='text-danger display-3'>SHOP</h1>
      </div>
      <h1 className='display-4' style={{ marginTop: '5rem' }}>
        {name}
      </h1>
      <hr style={{ border: '1px solid black' }} />
      {error && <p>{error.message}</p>}
      <Row className='w-100 mx-auto'>
        {products.map((product) => (
          <Col md={4} key={product._id}>
            <Productcard {...product} />
          </Col>
        ))}
      </Row>
    </Container>
  )
}
