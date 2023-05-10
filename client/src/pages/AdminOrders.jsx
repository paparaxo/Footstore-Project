import { useEffect, useState } from 'react'
import { useStateContext } from '../config/context'
import {
  cashOrder,
  getAllOrders,
  paypalDelivery,
  trackOrders,
} from '../api/api'
import { Button, Table } from 'react-bootstrap'
import { formatCurrency } from '../utils/formatCurrency'
import { Link } from 'react-router-dom'

const status = ['Preparing', 'On the way', 'Delivered']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const { currentUser } = useStateContext()

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${currentUser.token}`,
    },
  }
  useEffect(() => {
    getAllOrders(config)
      .then((res) => {
        setOrders(res.data)
      })
      .catch((error) => console.log(error))
  }, [])

  const handleUpdate = async (id) => {
    const item = orders.filter((order) => order._id === id)[0]
    const currentStatus = item.status
    try {
      const res = await trackOrders(id, { status: currentStatus + 1 }, config)
      setOrders([res.data, ...orders.filter((order) => order._id !== id)])
      if (item.paymentMethod === 'cash' && item.status === status.length - 3) {
        await cashOrder(id, orders, config)
      }
      if (
        item.paymentMethod === 'paypal' &&
        item.status === status.length - 3
      ) {
        await paypalDelivery(id, orders, config)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='p-2'>
      <p className='fs-6 mb-4 border-bottom'>Orders ({orders.length})</p>
      <Table striped bordered hover variant='dark' responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>OrderId</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Payment Mode</th>
            <th>Payment Status</th>
            <th>Order Status</th>
            <th>Delivery</th>
            <th>Action</th>
          </tr>
        </thead>
        {orders.map((order, i) => (
          <tbody key={i}>
            <tr>
              <td>{i}</td>
              <td>
                <Link
                  to={`/customer/orders/${order._id}`}
                  className={order.isDelivered ? 'text-success' : ''}
                >
                  {order._id}
                </Link>
              </td>
              <td>
                {order.shippingDetails?.firstName +
                  ' ' +
                  order.shippingDetails?.lastName}
              </td>
              <td>{formatCurrency(order.totalPrice)}</td>
              <td>{order.paymentMethod}</td>
              <td>{order.isPaid ? 'Paid' : 'Not Paid'}</td>
              <td>{status[order.status]}</td>
              <td>{order.isDelivered ? 'COMPLETED' : 'Not Delivered'}</td>
              <td>
                <Button
                  variant='danger'
                  className='rounded-0'
                  onClick={() => handleUpdate(order._id)}
                  disabled={order.isDelivered === true}
                >
                  UPDATE
                </Button>
              </td>
            </tr>
          </tbody>
        ))}
      </Table>
    </div>
  )
}