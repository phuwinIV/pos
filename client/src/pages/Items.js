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

const Items = () => {
   const [itemsData, setItemsData] = useState([]);
   const [addEditModalOpen, setAddEditModalOpen] = useState(false);
   const [editItem, setEditItem] = useState(null);

   const userLogin = useSelector((state) => state.userLogin);
   const { posUser } = userLogin;

   const productList = useSelector((state) => state.productList);
   const { loading, error, products } = productList;

   const dispatch = useDispatch();

   const deleteItem = async (record) => {
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
               <EditOutlined
                  className='mx-2'
                  onClick={() => {
                     setEditItem(record);
                     setAddEditModalOpen(true);
                  }}
               />
               <DeleteOutlined
                  className='mx-2'
                  onClick={() => deleteItem(record)}
               />
            </div>
         ),
      },
   ];

   useEffect(() => {
      dispatch(listProducts());
   }, [dispatch]);

   const onFinish = async (values) => {
      dispatch({ type: 'SHOW_LOADING' });
      if (editItem === null) {
         try {
            dispatch(createProduct(values));
            // await axios.post('/api/products', values, {
            //    headers: { Authorization: `Bearer ${posUser.token}` },
            // });
            // dispatch({ type: 'HIDE_LOADING' });

            message.success('Item Add Successfully');
            setAddEditModalOpen(false);
            // getAllItems();
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
            // getAllItems();
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
            <h3>ITEMS</h3>
            <Button type='primary' onClick={() => setAddEditModalOpen(true)}>
               {' '}
               Add Item
            </Button>
         </div>
         <Table columns={columns} dataSource={products} bordered />

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
