import React, { useEffect } from 'react';
import '../resourses/authentication.css';
import { Form, Input, Button, Row, Col } from 'antd';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';
const Register = () => {
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const onFinish = async (values) => {
      dispatch({ type: 'SHOW_LOADING' });
      try {
         const res = await axios.post('/api/users/register', values);
         dispatch({ type: 'HIDE_LOADING' });
         message.success('Resgister Success');
         navigate('/login');
      } catch (error) {
         dispatch({ type: 'HIDE_LOADING' });
         message.error('ERR');
      }
   };

   useEffect(() => {
      if (localStorage.getItem('pos-user')) navigate('/');
   }, []);

   return (
      <div className='authentication'>
         <Row>
            <Col lg={8} xs={22}>
               <Form layout='vertical' onFinish={onFinish}>
                  <h1>
                     {' '}
                     <b>POS</b>{' '}
                  </h1>
                  <hr />
                  <h3>Register</h3>
                  <Form.Item name='name' label='Name'>
                     <Input />
                  </Form.Item>
                  <Form.Item name='userId' label='User ID'>
                     <Input />
                  </Form.Item>

                  <Form.Item name='password' label='Password'>
                     <Input type='password' />
                  </Form.Item>

                  <div className='d-flex justify-content-between align-items-center'>
                     <Link to='/login'>Already Registed ? Here to login</Link>
                     <Button htmlType='submit' type='primary'>
                        {' '}
                        SAVE
                     </Button>
                  </div>
               </Form>
            </Col>
         </Row>
      </div>
   );
};

export default Register;
