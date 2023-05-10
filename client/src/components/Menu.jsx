// import React, { useState, useEffect } from "react";
// import { Modal } from "react-bootstrap";
// import { Link, NavLink } from "react-router-dom";
// import { getCategories } from "../api/api";

// export default function Menu() {
//   const [show, setShow] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [error, setError] = useState(null);
//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);

//   useEffect(() => {
//     getCategories()
//       .then((res) => {
//         setCategories(res.data);
//       })
//       .catch((error) => {
//         console.log(error);
//         setError(error);
//       });
//   }, []);
//   console.log("categories", categories);

//   return (
//     <>
//       <span className="fs-4 cursor" onClick={handleShow}>
//         MENU
//       </span>
//       <Modal show={show} onHide={handleClose} backdrop="static" fullscreen>
//         <Modal.Header className="bgModal">
//           <Modal.Title className="w-100">
//             <div className="d-flex align-items-center gap-4">
//               <Link to="/" onClick={handleClose} className="flex-grow-1">
//                 <h1 className="text-danger heading">Footshop</h1>
//               </Link>
//               <span className="fs-4 cursor fw-light">SEARCH</span>
//               <span className="fs-4 cursor fw-light" onClick={handleClose}>
//                 CLOSE
//               </span>
//             </div>
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="bgModal">
//           {error && <p>{error.message}</p>}
//           {categories.map((category) => (
//             <NavLink
//               key={category._id}
//               to={`/products/category/${category.name}`}
//               className={({ isActive }) => (isActive ? "text-danger" : "")}
//               onClick={handleClose}
//             >
//               <h1 className="display-3 hover-link">{category.name}</h1>
//             </NavLink>
//           ))}
//           <NavLink
//             to="/account"
//             className={({ isActive }) => (isActive ? 'text-danger' : '')}
//             onClick={handleClose}
//           >
//             <h1>Account</h1>
//           </NavLink>
//         </Modal.Body>
//       </Modal>
//     </>
//   );
// }

import { useEffect, useState } from 'react'
import { Modal, Accordion, Form, Button } from 'react-bootstrap'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import { AiOutlineClose } from 'react-icons/ai'
import { getCategories } from '../api/api'
import { useStateContext } from '../config/contex'

export default function Menu() {
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const queryParams = query.get('q')
  const [show, setShow] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState(queryParams)
  const [categories, setCategories] = useState([])
  const { currentUser, logout } = useStateContext()
  const navigate = useNavigate()

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  useEffect(() => {
    getCategories()
      .then((res) => {
        setCategories(res.data)
      })
      .catch((error) => console.log(error))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchQuery) {
      navigate(`search/?q=${searchQuery}`)
      handleClose()
      setShowSearch(!showSearch)
    }
  }
  const handleLogout = () => {
    logout()
    navigate('/account')
    handleClose()
  }

  return (
    <>
      <span className='fs-4 cursor' onClick={handleShow}>
        MENU
      </span>
      <Modal show={show} onHide={handleClose} backdrop='static' fullscreen>
        <Modal.Header className='bgModal'>
          <Modal.Title className='w-100'>
            {showSearch ? (
              <div className='border-0 border-bottom border-dark w-100 d-flex gap-4 align-items-center'>
                <Form onSubmit={handleSubmit} className='w-100 d-flex '>
                  <Button variant='none' type='submit'>
                    <FiSearch size='1.8rem' />
                  </Button>
                  <input
                    type='text'
                    placeholder='Search Footstore...'
                    className='border-dark bg-transparent py-2'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </Form>
                <AiOutlineClose
                  className=' cursor'
                  size='1.8rem'
                  onClick={() => {
                    setShowSearch(!showSearch)
                    setSearchQuery('')
                  }}
                />
              </div>
            ) : (
              <div className='d-flex align-items-center gap-4'>
                <Link to='/' onClick={handleClose} className='flex-grow-1'>
                  <h1 className='fw-bold heading text-danger'>Footshop</h1>
                </Link>
                <span
                  className='fs-4 cursor fw-light'
                  onClick={() => setShowSearch(!showSearch)}
                >
                  SEARCH
                </span>
                <span className='fs-4 cursor fw-light' onClick={handleClose}>
                  CLOSE
                </span>
              </div>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='bgModal'>
          {categories.map((category) => (
            <NavLink
              key={category._id}
              to={`/products/category/${category.name}`}
              className={({ isActive }) => (isActive ? 'text-danger ' : '')}
              onClick={handleClose}
            >
              <h1 className='display-3 hover-link'>{category.name}</h1>
            </NavLink>
          ))}
          <div className='border-0 border-bottom border-dark mt-4' />
          {currentUser ? (
            <>
              <h1 className='display-3 cursor d-none d-lg-block text-capitalize'>
                Hi, {currentUser.name}
              </h1>
              <Accordion flush className='d-lg-none mt-2'>
                <Accordion.Item eventKey='0' className='bg-Modal'>
                  <Accordion.Header>
                    <h1 className='display-3 cursor text-capitalize'>
                      Hi, {currentUser.name}
                    </h1>
                  </Accordion.Header>
                  <Accordion.Body>
                    <Link to='customer/profile' onClick={handleClose}>
                      <p className='fs-4 mb-0 hover-link'>Account</p>
                    </Link>
                    <Link to='customer/orders' onClick={handleClose}>
                      <p className='fs-4 mb-0 hover-link'>Orders</p>
                    </Link>
                    {currentUser.token && currentUser?.isAdmin === true && (
                      <>
                        <Link to='customer/admin/orders' onClick={handleClose}>
                          <p className='fs-4 mb-0 hover-link'>Admin</p>
                        </Link>
                        <Link
                          to='customer/admin/products'
                          onClick={handleClose}
                        >
                          <p className='fs-4 mb-0 hover-link'>Products</p>
                        </Link>
                      </>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <p onClick={handleLogout} className='fs-4 cursor mt-4'>
                Logout
              </p>
            </>
          ) : (
            <Link to='/account' onClick={handleClose}>
              <h1 className='display-3 cursor mt-3 hover-link'>Account</h1>
            </Link>
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}
