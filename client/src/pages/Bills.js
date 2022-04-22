import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DefaultLayout from '../components/DefaultLayout';
import {
   EyeOutlined,
   CheckCircleOutlined,
   CloseCircleTwoTone,
} from '@ant-design/icons';
import { Button, Spin, Table } from 'antd';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import { Modal, message } from 'antd';
import {
   listOrders,
   updateBillToCheck,
   updatetBillToCancle,
} from '../actions/billAction';
import { Space } from 'antd';

const Bills = () => {
   const componentRef = useRef();
   const [printBillModalOpen, setPrintBillModalOpen] = useState(false);
   const [selectedBill, setSelectedBill] = useState(null);

   const orderList = useSelector((state) => state.orderList);
   const { loading, error, orders } = orderList;

   const billUpdate = useSelector((state) => state.billUpdate);
   const { success: BillUpdateSuccess } = billUpdate;

   const dispatch = useDispatch();

   const updatetBillToCancleP = (record) => {
      const id = record._id;
      dispatch(updatetBillToCancle(id));
      message.warning('ยกเลิกบิล');
   };

   const updateBillToCheckP = (record) => {
      const id = record._id;
      dispatch(updateBillToCheck(id));
      message.info('จ่ายแล้ว');
   };

   const columns = [
      {
         title: 'พนักงาน',
         dataIndex: 'user',
         render: (user) => <p> {user.name} </p>,
      },
      {
         title: 'ราคาก่อนภาษี',
         dataIndex: 'subTotal',
      },
      {
         title: 'ภาษี',
         dataIndex: 'taxPrice',
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
         title: 'วันที่',
         dataIndex: 'createdAt',
         render: (createdAt) => (
            <div> {createdAt.toString().substring(0, 10)} </div>
         ),
      },
      {
         title: 'สถานะ',
         dataIndex: 'isPaid',
         render: (isPaid) => (
            <div>
               {isPaid ? (
                  <>
                     <h5 className='text-info'> จ่ายแล้ว </h5>{' '}
                  </>
               ) : (
                  <>
                     <h5 className='text-danger'> ยกเลิก</h5>{' '}
                  </>
               )}
            </div>
         ),
      },
      {
         title: 'Actions',
         dataIndex: '_id',
         render: (id, record) => (
            <div className='d-flex'>
               <Space>
                  <EyeOutlined
                     className='text-success'
                     onClick={() => {
                        setSelectedBill(record);
                        setPrintBillModalOpen(true);
                     }}
                  />
                  <CloseCircleTwoTone
                     twoToneColor='#fd6159'
                     onClick={() => updatetBillToCancleP(record)}
                  />
                  <CheckCircleOutlined
                     className='text-info'
                     onClick={() => updateBillToCheckP(record)}
                  />
               </Space>
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
      dispatch(listOrders());
   }, [dispatch, BillUpdateSuccess]);

   const handlePrint = useReactToPrint({
      content: () => componentRef.current,
   });

   return (
      <DefaultLayout>
         <div className='d-flex justify-content-between'>
            <h3>รายการขาย</h3>
         </div>
         {loading ? (
            <Spin className='loader' size='large' />
         ) : error ? (
            <h1>ไม่มีรายการ</h1>
         ) : (
            <Table columns={columns} dataSource={orders} bordered />
         )}

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
                        <b> ราคาก่อนภาษี : {selectedBill.subTotal} </b>
                     </p>

                     <p>
                        <b> ภาษี</b> : {selectedBill.taxPrice}{' '}
                     </p>
                     <br />
                  </div>

                  <div>
                     <h2>
                        <b>ราคาสินค้าทั้งหมด: </b> {selectedBill.totalPrice}{' '}
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
