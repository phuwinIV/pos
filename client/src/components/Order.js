import React, { useEffect, useState } from 'react';
import { Button, List, Avatar, Modal, Tabs } from 'antd';
import {
   DeleteOutlined,
   PlusCircleOutlined,
   MinusCircleOutlined,
} from '@ant-design/icons';
import '../resourses/layout.css';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart } from '../actions/cartAction';
import { createOrder } from '../actions/billAction';

import { message } from 'antd';
import { BILL_CREATE_RESET } from '../constans/billConstans';
import { Form } from 'antd';
import { Input } from 'antd';
import QRcode from 'qrcode.react';
import generatePayload from 'promptpay-qr';
import { Typography } from 'antd';

const { TabPane } = Tabs;

const Order = () => {
   const [subTotal, setSubtotal] = useState(0);
   const [payment, SetPayment] = useState('');

   const [modalOpen, setModalOpen] = useState(false);
   const [getMoney, setGetMoney] = useState(0);
   const [moneyChange, setMoneyChange] = useState(0);

   const [phoneNumber, setPhoneNumber] = useState('0956615016');
   const [amount, setAmount] = useState(1.0);
   const [qrCode, setqrCode] = useState('');

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

      let mc = 0;

      mc = getMoney - cartItems.totalPrice;

      setMoneyChange(Number(mc));

      setSubtotal(temp);
   }, [cartItems, getMoney]);

   const handlePhoneNumber = (e) => {
      setPhoneNumber(e.target.value);
   };

   const handleQR = () => {
      setqrCode(generatePayload(phoneNumber, { amount }));
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
      setModalOpen(false);
   };

   const orderPrepare = () => {
      SetPayment('Cash');
      console.log(payment);
      setModalOpen(true);
      setAmount(parseFloat(cartItems.totalPrice));
      handleQR();
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
                     <h4>ราคารวมสุทธิ</h4>
                     <h3>
                        <b>{Number(subTotal).toFixed(2)}</b>
                     </h3>
                  </div>
                  <div className='d-flex'>
                     <Button type='primary' onClick={orderPrepare} block>
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
                     avatar={
                        <Avatar size={54} shape='square' src={item.image} />
                     }
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
            <div>
               <Tabs
                  onTabClick={(key) => {
                     if (key === '1') {
                        SetPayment('Cash');
                        console.log(payment);
                     } else {
                        SetPayment('Promtpay');
                        console.log(payment);
                     }
                  }}
                  defaultActiveKey='1'
                  type='card'>
                  <TabPane tab='เงินสด' key='1'>
                     <div>
                        <Form.Item name='getMoney' label='THB'>
                           <Input
                              onChange={(e) => setGetMoney(e.target.value)}
                           />
                        </Form.Item>
                        <div className='d-flex  justify-content-between'>
                           <h4>เงินสด</h4>
                           <h3> {getMoney} </h3>
                        </div>
                        <div className='d-flex  justify-content-between'>
                           <h4>รวมสุทธิ</h4>
                           <h3>{Number(subTotal).toFixed(2)}</h3>
                        </div>
                        <div className='d-flex justify-content-between'>
                           <h4> เงินทอน</h4>
                           <h3>{moneyChange}</h3>
                        </div>
                        <Button
                           type='primary'
                           onClick={() => {
                              orderCreateHandle();
                              SetPayment('Cash');
                           }}
                           block>
                           ยืนยันการชำระ
                        </Button>
                     </div>
                  </TabPane>
                  <TabPane tab='พร้อมเพย์' key='2'>
                     <div>
                        <h3
                           className='text-center'
                           style={{ backgroundColor: 'skyblue' }}>
                           {' '}
                           THAI QR PAYMENT{' '}
                        </h3>
                        <Button onClick={handleQR}> QR CODE </Button>
                        <br />
                        <div className='text-center'>
                           {' '}
                           <QRcode
                              style={{ width: '200px', height: 'auto' }}
                              value={qrCode}
                           />
                           <br />
                           <Typography.Title level={2}>
                              ชื่อบัญชี xxx
                           </Typography.Title>
                           <p className='text-lead'> {cartItems.totalPrice} </p>
                        </div>
                        <Button
                           type='primary'
                           onClick={() => {
                              orderCreateHandle();
                              SetPayment('Promtpay');
                           }}
                           block>
                           ยืนยันการชำระ
                        </Button>
                     </div>
                  </TabPane>
               </Tabs>
            </div>
         </Modal>
      </>
   );
};

export default Order;
