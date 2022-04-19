import React, { useEffect, useState } from 'react';
import { Button, List } from 'antd';
import {
   DeleteOutlined,
   PlusCircleOutlined,
   MinusCircleOutlined,
} from '@ant-design/icons';
import '../resourses/layout.css';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart } from '../actions/cartAction';
import { Avatar, Modal } from 'antd';
import { createOrder } from '../actions/billAction';
import { Select } from 'antd';

import { message } from 'antd';
import { BILL_CREATE_RESET } from '../constans/billConstans';
import { Radio } from 'antd';

const { Option } = Select;

const Order = () => {
   const [subTotal, setSubtotal] = useState(0);
   const [payment, SetPayment] = useState('Cash');
   const [quantity, setQty] = useState(1);
   const [modalOpen, setModalOpen] = useState(false);

   const dispatch = useDispatch();

   const cart = useSelector((state) => state.cart);
   const { cartItems } = cart;

   const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
   };

   cartItems.itemsPrice = addDecimals(
      cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
   );

   cartItems.taxPrice = addDecimals(Number((subTotal * (7 / 107)).toFixed(2)));

   cartItems.totalPrice = (
      subTotal -
      cartItems.taxPrice +
      Number(cartItems.taxPrice)
   ).toFixed(2);

   const orderCreate = useSelector((state) => state.orderCreate);
   const { success } = orderCreate;

   const increasQty = (item) => {
      dispatch({
         type: 'UPDATE_CART',
         payload: { ...item, quantity: item.quantity + 1 },
      });
   };

   const decreasQty = (item) => {
      if (item.quantity !== 1) {
         dispatch({
            type: 'UPDATE_CART',
            payload: { ...item, quantity: item.quantity - 1 },
         });
      }
   };

   const removeFromCartHandle = (id) => {
      dispatch(removeFromCart(id));
   };

   useEffect(() => {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
   }, [cartItems]);

   useEffect(() => {
      let temp = 0;
      cartItems.forEach((item) => {
         temp = temp + item.price * item.quantity;
      });

      setSubtotal(temp);
   }, [cartItems]);

   const PaymentHandle = (value) => {
      SetPayment(value);
      console.log(payment);
      if (payment === 'promtpay') {
         setModalOpen(true);
      }
   };

   const orderCreateHandle = () => {
      dispatch(
         createOrder({
            orderItems: cartItems,
            paymentMethod: payment,
            itemsPrice: cartItems.itemsPrice,
            taxPrice: cartItems.taxPrice,
            subTotal: subTotal - cartItems.taxPrice,
            totalPrice: cartItems.totalPrice,
         })
      );
   };
   useEffect(() => {
      if (success) {
         dispatch({ type: BILL_CREATE_RESET });
         message.success('Bill Created');
      }
   }, [dispatch, success, cartItems]);

   return (
      <>
         <List
            header={
               <>
                  <div className='d-flex  justify-content-between'>
                     <h4>ราคาก่อนลด</h4>
                     <h3>
                        Total :<b>{Number(subTotal).toFixed(2)}</b>
                     </h3>
                  </div>
                  <div className='d-flex'>
                     <Button type='primary' onClick={orderCreateHandle} block>
                        ชำระเงิน
                     </Button>
                  </div>
               </>
            }
            footer={<div></div>}
            bordered
            dataSource={cartItems}
            renderItem={(item) => (
               <List.Item key={item._id}>
                  <List.Item.Meta
                     onClick={() => setModalOpen(true)}
                     style={{ cursor: 'pointer' }}
                     avatar={<Avatar src={item.image} />}
                     title={item.name}
                     description={
                        <>
                           <p>
                              {' '}
                              {item.price} x {item.quantity}
                           </p>
                        </>
                     }
                  />
                  <div>
                     <PlusCircleOutlined
                        className='mx-3'
                        onClick={() => increasQty(item)}
                     />
                     <b>{item.quantity}</b>
                     <MinusCircleOutlined
                        className='mx-3'
                        onClick={() => decreasQty(item)}
                     />
                  </div>
                  <div>
                     <DeleteOutlined
                        onClick={() => removeFromCartHandle(item.product)}
                     />
                  </div>
               </List.Item>
            )}></List>

         <Modal
            visible={modalOpen}
            footer={false}
            onCancel={() => {
               setModalOpen(false);
            }}>
            555
         </Modal>
      </>
   );
};

export default Order;
