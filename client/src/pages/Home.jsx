import React, { useState, useEffect } from "react";
import { Button, Col, Image, Row, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAllProducts, getFeaturedProducts } from "../api/api";
import ImageSlider from "../components/ImageSlider";
import Productcard from "../components/Productcard";
import Spinner from "../utils/spinner";

export default function Home() {
  const [hero, setHero] = useState([]);
  const [casual, setCasual] = useState([]);
  const [sandals, setSandals] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.document.title = "Home"
    getFeaturedProducts()
      .then((res) => {
        setHero(res.data);
      })
      .catch((error) => {
        setError(error);
      })
  }, []);

  useEffect(() => {
    getAllProducts()
      .then((res) => {
        setCasual(res.data);
        setSandals(res.data);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  const heroProduct = hero?.filter(
    (product) => product.title === "Black Chuck 70 Hi Sneakers"
  );
  const casualPicks = casual?.filter(
    (product) =>
      product.category === "Sneakers" &&
      product.title !== "Black Chuck 70 Hi Sneakers"
  );

  const slipons = sandals?.filter((product) => product.category === "Sandals");

  if (!hero | !casual | !sandals) return <Spinner />

  return (
    <Container className="mt-5 py-5">
      <div className="border border-danger px-2 logo-width">
        <p className="texting mb-0">Footshop</p>
        <h1 className="text-danger display-3">SHOP</h1>
      </div>
      <h1
        className="text-danger text-end display-3"
        style={{ marginTop: "5rem" }}
      >
        Fashion
      </h1>
      <div style={{ border: "1px solid red" }} />
      {error && <p>{error.message}</p>}
      <Row className="w-100 mx-auto mt-3">
        {heroProduct.map((product) => (
          <Col md={6} key={product._id}>
            <Image
              src={product?.images?.[0]}
              alt={product.title}
              className="img-fluid"
            />
          </Col>
        ))}
        <Col>
          <p className="small text-danger mb-0"> STYLE</p>
          <p className="texting">The converse flexes Lagos to Abuja</p>
          {heroProduct.map((product) => (
            <Link to={`/product/${product.slug}`} key={product._id}>
              <Button variant="dark" className="rounded-0">
                BUY NOW
              </Button>
            </Link>
          ))}
        </Col>
      </Row>
      <h1
        className="text-danger text-end display-3"
        style={{ marginTop: "5rem" }}
      >
          Casual picks
      </h1>
      <hr className='mb-5' style={{ border: '1px solid red' }} />
      <ImageSlider slides={casualPicks} />
      <h1
        className='text-danger text-end display-3'
        style={{ marginTop: '5rem' }}
      >
        Slip on
      </h1>
      <hr className='mb-5' style={{ border: '1px solid red' }} />
      <p className='small text-danger mb-0'>COMFY</p>
      <p className='texting'>Feel chic on these, smooth comfort all day.</p>
      <Row className='w-100 mx-auto'>
        {slipons.slice(0, 4).map((product) => (
          <Col md={6} lg={4} key={product._id}>
            <Productcard {...product} />
          </Col>
        ))}
      </Row>
    </Container>
  )
}
