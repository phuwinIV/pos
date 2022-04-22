
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
import { Space } from 'antd';

const Employee = () => {
   const [modalOpen, setModalOpen] = useState(false);
   const [editUser, setEditUser] = useState(null);

   const dispatch = useDispatch();

   const userLogin = useSelector((state) => state.userLogin);
   const { posUser } = userLogin;

   const userList = useSelector((state) => state.userList);
   const { loading, users } = userList;

   const userRegister = useSelector((state) => state.userRegister);
   const { success: successRegister, error: errorRegister } = userRegister;

   const userDelete = useSelector((state) => state.userDelete);
   const { success: successDelete } = userDelete;

   const userUpdate = useSelector((state) => state.userUpdate);
   const {
      loading: loadingUpdate,
      error: errorUpdate,
      success: successUpdate,
   } = userUpdate;

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
               <Space>
                  {posUser._id === record._id && (
                     <EditOutlined
                        className='text-warning'
                        onClick={() => {
                           setEditUser(record);
                           setModalOpen(true);
                        }}
                     />
                  )}
                  <DeleteOutlined
                     className='text-danger'
                     onClick={() => deleteHandler(id)}
                  />
               </Space>
               {id === posUser._id && <></>}
            </div>
         ),
      },
   ];

   useEffect(() => {
      dispatch(listUsers());
   }, [dispatch, successDelete, successUpdate, successRegister]);

   const onFinish = (values) => {
      if (editUser === null) {
         try {
            dispatch(register(values));
            if (successRegister) message.success('Employee created');
            setModalOpen(false);
         } catch (errorRegister) {
            dispatch(loading);
            message.error(errorRegister);
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
            {loadingUpdate && <Spin />}
            {errorUpdate && message.error(errorUpdate)}
            {errorRegister && message.error(errorRegister)}
            <h3>พนักงาน</h3>
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

                  <Form.Item name='password' label='password'>
                     <Input type='password' />
                  </Form.Item>

                  <Form.Item name='number' label='Phone Number'>
                     <Input type='number' />
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
