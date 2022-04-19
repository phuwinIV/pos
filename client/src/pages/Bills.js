import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DefaultLayout from '../components/DefaultLayout';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Table } from 'antd';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import { Modal, message, Form, Input, Select } from 'antd';

const Bills = () => {
   const componentRef = useRef();
   const [billsData, setBillsData] = useState([]);
   const [printBillModalOpen, setPrintBillModalOpen] = useState(false);
   const [selectedBill, setSelectedBill] = useState(null);

   const userLogin = useSelector((state) => state.userLogin);
   const { loading, error, posUser } = userLogin;

   const dispatch = useDispatch();

   const getAllBills = async () => {
      dispatch({ type: 'SHOW_LOADING' });
      try {
         const config = {
            headers: {
               Authorization: `Bearer ${posUser.token}`,
            },
         };
         const res = await axios.get('/api/bills', config);

         setBillsData(res.data);
         dispatch({ type: 'HIDE_LOADING' });
      } catch (error) {
         dispatch({ type: 'SHOW_LOADING' });
         console.log(error);
      }
   };

   const columns = [
      {
         title: 'Id',
         dataIndex: '_id',
      },
      {
         title: 'พนักงาน',
         dataIndex: 'user',
         render: (user) => <p> {user.name} </p>,
      },
      {
         title: 'ราคาสินค้า',
         dataIndex: 'itemsPrice',
      },
      {
         title: 'ภาษี',
         dataIndex: 'taxPrice',
      },
      {
         title: 'ราคาก่อนภาษี',
         dataIndex: 'subTotal',
      },
      {
         title: 'ราคาสินค้าทั้งหมด',
         dataIndex: 'totalPrice',
      },
      {
         title: 'ชำระโดย',
         dataIndex: 'paymentMethod',
      },
      {
         title: 'Actions',
         dataIndex: '_id',
         render: (id, record) => (
            <div className='d-flex'>
               <EyeOutlined
                  className='mx-2'
                  onClick={() => {
                     console.log(record);
                     setSelectedBill(record);
                     setPrintBillModalOpen(true);
                  }}
               />
            </div>
         ),
      },
   ];

   const cartscolumns = [
      {
         title: 'Name ',
         dataIndex: 'name',
      },
      {
         title: 'Price',
         dataIndex: 'price',
         sorter: {
            compare: (a, b) => a.price - b.price,
            multiple: 2,
         },
      },
      {
         title: 'Quantity',
         dataIndex: '_id',
         render: (id, record) => (
            <div>
               <b>{record.quantity} </b>
            </div>
         ),
         sorter: {
            compare: (a, b) => a.quantity - b.quantity,
            multiple: 2,
         },
      },
      {
         title: 'Total Price',
         dataIndex: '_id',
         render: (id, record) => (
            <div>
               <b>{record.quantity * record.price} </b>
            </div>
         ),
         sorter: {
            compare: (a, b) => a.price - b.price,
            multiple: 2,
         },
      },
   ];

   useEffect(() => {
      getAllBills();
   }, []);

   const handlePrint = useReactToPrint({
      content: () => componentRef.current,
   });

   return (
      <DefaultLayout>
         <div className='d-flex justify-content-between'>
            <h3>ITEMS</h3>
         </div>
         <Table columns={columns} dataSource={billsData} bordered />

         {printBillModalOpen && (
            <Modal
               title='Bill Details'
               visible={printBillModalOpen}
               footer={false}
               width={800}
               onCancel={() => {
                  setPrintBillModalOpen(false);
               }}>
               <div className='bill-modal p-3' ref={componentRef}>
                  <div className='d-flex justify-content-between bill-header pb-2'>
                     <div>
                        <h1>
                           <b>POS</b>
                        </h1>
                     </div>
                     <div>
                        <p>address</p>
                        <p>test name</p>
                        <p>123456</p>
                     </div>
                  </div>
                  <div className='bill-customer-details my-2'>
                     <p>
                        <b> Name: </b>
                        {selectedBill.user.name}{' '}
                     </p>
                     <p>
                        <b>Date</b> :{' '}
                        {selectedBill.createdAt.toString().substring(0, 10)}{' '}
                     </p>
                  </div>
                  <Table
                     dataSource={selectedBill.orderItems}
                     columns={cartscolumns}
                     pagination={false}
                  />
                  <br />
                  <div className='dotted-border'>
                     <p>
                        <b> SUB TOTAL : {selectedBill.subTotal} </b>
                     </p>

                     <p>
                        <b> TAX </b> : {selectedBill.taxPrice}{' '}
                     </p>
                     <br />
                  </div>

                  <div>
                     <h2>
                        <b>TOTAL PRICE: </b> {selectedBill.totalPrice}{' '}
                     </h2>
                  </div>

                  <div className='dotted-border mt-2 '></div>
               </div>
               <div className='d-flex justify-content-end'>
                  <Button type='primary' onClick={handlePrint}>
                     {' '}
                     Print Bill{' '}
                  </Button>
               </div>
            </Modal>
         )}
      </DefaultLayout>
   );
};

export default Bills;
