const axios = require('axios')

let shiprocketToken = null

const generateShiprocketToken = async () => {
  const response = await axios.post(
    'https://apiv2.shiprocket.in/v1/external/auth/login',
    {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }
  )

  shiprocketToken = response.data.token
  return shiprocketToken
}

const createShiprocketOrder = async (order, user) => {
  if (!shiprocketToken) {
    await generateShiprocketToken()
  }

  const response = await axios.post(
    'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
    {
      order_id: order._id.toString(),
      order_date: new Date(),
      pickup_location: 'Primary',

      billing_customer_name: user.name,
      billing_last_name: '',
      billing_address: order.shippingAddress.address,
      billing_city: order.shippingAddress.city,
      billing_pincode: order.shippingAddress.postalCode,
      billing_state: order.shippingAddress.state,
      billing_country: 'India',
      billing_email: user.email,
      billing_phone: order.shippingAddress.phone,

      order_items: order.orderItems.map((item) => ({
        name: item.name,
        sku: item.product.toString(),
        units: item.qty,
        selling_price: item.price,
      })),

      payment_method: order.isPaid ? 'Prepaid' : 'COD',
      sub_total: order.totalPrice,

      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5,
    },
    {
      headers: {
        Authorization: `Bearer ${shiprocketToken}`,
      },
    }
  )

  return response.data
}

module.exports = { createShiprocketOrder }