import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DefaultLayout from '../components/DefaultLayout';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Table } from 'antd';
import { Modal, message, Form, Input, Select } from 'antd';
import {
   createProduct,
   deleteProduct,
   listProducts,
} from '../actions/productActions';
import { Space } from 'antd';
import { Spin } from 'antd';

const Items = () => {
   const [addEditModalOpen, setAddEditModalOpen] = useState(false);
   const [editItem, setEditItem] = useState(null);

   const userLogin = useSelector((state) => state.userLogin);
   const { posUser } = userLogin;

   const productList = useSelector((state) => state.productList);
   const { loading, error, products } = productList;

   const productDelete = useSelector((state) => state.productDelete);
   const { success: productDeleteSuccess } = productDelete;

   const dispatch = useDispatch();

   const deleteItem = (record) => {
      if (window.confirm('Are you sure')) {
         const itemId = record._id;
         dispatch(deleteProduct(itemId));
         message.success('Item deleted');
      }
   };

   const columns = [
      {
         title: 'Name',
         dataIndex: 'name',
      },
      {
         title: 'Image',
         dataIndex: 'image',
         render: (image, record) => (
            <img
               src={image}
               alt=''
               style={{ objectFit: 'cover' }}
               height='100'
               width='100'
            />
         ),
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
         title: 'Category',
         dataIndex: 'category',
      },
      {
         title: 'Actions',
         dataIndex: '_id',
         render: (id, record) => (
            <div className='d-flex'>
               <Space>
                  <EditOutlined
                     className='text-warning'
                     onClick={() => {
                        setEditItem(record);
                        setAddEditModalOpen(true);
                     }}
                  />
                  <DeleteOutlined
                     className='text-danger'
                     onClick={() => deleteItem(record)}
                  />
               </Space>
            </div>
         ),
      },
   ];

   useEffect(() => {
      dispatch(listProducts());
   }, [dispatch, productDeleteSuccess]);

   const onFinish = async (values) => {
      dispatch({ type: 'SHOW_LOADING' });
      if (editItem === null) {
         try {
            dispatch(createProduct(values));
            message.success('Item Add Successfully');
            setAddEditModalOpen(false);
         } catch (error) {
            dispatch({ type: 'SHOW_LOADING' });
            message.error('Err Add Item');
            console.log(error);
         }
      }
      // EDIT ITEM
      else {
         const itemId = editItem._id;
         try {
            await axios.put(
               `/api/products/${itemId}`,
               {
                  ...values,
               },
               { headers: { Authorization: `Bearer ${posUser.token}` } }
            );
            dispatch({ type: 'HIDE_LOADING' });

            message.success('Edit Item Successfully');
            setEditItem(null);
            setAddEditModalOpen(false);
         } catch (error) {
            dispatch({ type: 'SHOW_LOADING' });
            message.error('Err Edit Item');
            console.log(error);
         }
      }
   };

   return (
      <DefaultLayout>
         <div className='d-flex justify-content-between'>
            <h3>รายการสินค้า</h3>
            <Button type='primary' onClick={() => setAddEditModalOpen(true)}>
               {' '}
               Add Item
            </Button>
         </div>
         {loading ? (
            <Spin className='loader' size='large' />
         ) : error ? (
            <h1>ไม่มีสิค้า</h1>
         ) : (
            <Table columns={columns} dataSource={products} bordered />
         )}

         {addEditModalOpen && (
            <Modal
               title={`${editItem !== null ? 'Edit Item' : 'Add new Item'}`}
               visible={addEditModalOpen}
               footer={false}
               onCancel={() => {
                  setEditItem(null);
                  setAddEditModalOpen(false);
               }}>
               <Form
                  initialValues={editItem}
                  layout='vertical'
                  onFinish={onFinish}>
                  <Form.Item name='name' label='Name'>
                     <Input />
                  </Form.Item>

                  <Form.Item name='price' label='Price'>
                     <Input />
                  </Form.Item>

                  <Form.Item name='image' label='Image'>
                     <Input />
                  </Form.Item>

                  <Form.Item name='category' label='Category'>
                     <Select>
                        <Select.Option value='Type'>Type </Select.Option>
                        <Select.Option value='coffee'> Coffee </Select.Option>
                        <Select.Option value='dessert'>Dessert</Select.Option>
                        <Select.Option value='food'> Food </Select.Option>
                     </Select>
                  </Form.Item>

                  <div className='d-flex justify-content-end'>
                     <Button htmlType='submit' type='primary'>
                        {' '}
                        SAVE
                     </Button>
                  </div>
               </Form>
            </Modal>
         )}
      </DefaultLayout>
   );
};

export default Items;
