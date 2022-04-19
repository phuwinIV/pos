import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DefaultLayout from '../components/DefaultLayout';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Table } from 'antd';
import { Modal, message, Form, Input, Spin } from 'antd';
import {
   deleteUser,
   listUsers,
   register,
   updateUser,
} from '../actions/userActions';

const Employee = () => {
   const componentRef = useRef();
   const [usersData, setUsersData] = useState([]);
   const [modalOpen, setModalOpen] = useState(false);
   const [editUser, setEditUser] = useState(null);

   const dispatch = useDispatch();

   // const userRegister = useSelector((state) => state.userRegister);
   // const { loading, error } = userRegister;

   const userLogin = useSelector((state) => state.userLogin);
   const { posUser } = userLogin;
   console.log(posUser);

   const userList = useSelector((state) => state.userList);
   const { loading, error, users } = userList;

   const userDelete = useSelector((state) => state.userDelete);
   const { success: successDelete } = userDelete;

   const userUpdate = useSelector((state) => state.userUpdate);
   const {
      loading: loadingUpdate,
      error: errorUpdate,
      success: successUpdate,
   } = userUpdate;

   const getAllusers = async () => {
      dispatch({ type: 'SHOW_LOADING' });
      try {
         const res = await axios.get('/api/users');

         setUsersData(res.data);
         dispatch({ type: 'HIDE_LOADING' });
      } catch (error) {
         dispatch({ type: 'SHOW_LOADING' });
         console.log(error);
      }
   };

   const deleteHandler = (id) => {
      if (window.confirm('Are you sure')) {
         dispatch(deleteUser(id));
      }
   };

   const columns = [
      {
         title: 'name',
         dataIndex: 'name',
      },
      {
         title: 'UserID',
         dataIndex: 'userId',
      },
      {
         title: 'Phone Number',
         dataIndex: 'number',
      },
      {
         title: 'Created On',
         dataIndex: 'createdAt',
         render: (value) => <span> {value.toString().substring(0, 10)} </span>,
      },
      {
         title: 'Actions',
         dataIndex: '_id',
         render: (id, record) => (
            <div className='d-flex'>
               <EditOutlined
                  className='mx-2'
                  onClick={() => {
                     setEditUser(record);
                     setModalOpen(true);
                  }}
               />
               <DeleteOutlined onClick={() => deleteHandler(id)} />
               {id === posUser._id && <></>}
            </div>
         ),
      },
   ];
   const errorMsg = () => {
      message.error(error);
   };

   useEffect(() => {
      dispatch(listUsers());
   }, [dispatch, successDelete, successUpdate]);

   const onFinish = (values) => {
      if (editUser === null) {
         try {
            dispatch(register(values));
            message.success('Employee created');
            setModalOpen(false);
         } catch (error) {
            dispatch(loading);
            message.error(error);
         }
      } else {
         try {
            const user_id = editUser._id;
            dispatch(updateUser(user_id, values));
            setEditUser(null);
            setModalOpen(false);
         } catch (error) {
            <Spin />;
            message.error('Err update Item' + errorUpdate);
            console.log(errorUpdate);
         }
      }
   };

   return (
      <DefaultLayout>
         <div className='d-flex justify-content-between'>
            {loadingUpdate && <Spin tip='...Loading' />}
            <h3>Employee</h3>
            <Button type='primary' onClick={() => setModalOpen(true)}>
               {' '}
               Add Employee
            </Button>
         </div>
         <Table columns={columns} dataSource={users} bordered />
         {modalOpen && (
            <Modal
               title={`${editUser !== null ? 'Edit User' : 'Add New User'}`}
               visible={modalOpen}
               footer={false}
               onCancel={() => {
                  setModalOpen(false);
               }}>
               <Form
                  layout='vertical'
                  initialValues={editUser}
                  onFinish={onFinish}>
                  <Form.Item name='name' label='Name'>
                     <Input />
                  </Form.Item>

                  <Form.Item name='userId' label='userId'>
                     <Input />
                  </Form.Item>

                  <Form.Item name='number' label='Phone Number'>
                     <Input type='password' />
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

export default Employee;
