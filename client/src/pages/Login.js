import React, { useEffect } from 'react';
import '../resourses/authentication.css';
import { Form, Input, Button, Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';
import { login } from '../actions/userActions';

const Login = () => {
   const dispatch = useDispatch();
   const userLogin = useSelector((state) => state.userLogin);
   const { loading, error, posUser } = userLogin;

   const navigate = useNavigate();

   const onFinish = (values) => {
      try {
         dispatch(login(values));
      } catch (err) {
         message.error('ERR :' + error);
         console.log('ERR' + error);
      }
   };

   const errorMsg = () => {
      message.error(error);
   };

   useEffect(() => {
      if (posUser) {
         navigate('/');
      }
   }, [navigate, posUser]);

   useEffect(() => {
      if (localStorage.getItem('posUser')) navigate('/');
   }, []);

   return (
      <div className='authentication'>
         {error && errorMsg()}
         <Row>
            <Col lg={8} xs={22}>
               <Form layout='vertical' onFinish={onFinish}>
                  <h1>
                     {' '}
                     <b>POS</b>{' '}
                  </h1>
                  <hr />
                  <h3>Login</h3>

                  <Form.Item name='userId' label='User ID'>
                     <Input />
                  </Form.Item>

                  <Form.Item name='password' label='Password'>
                     <Input type='password' />
                  </Form.Item>

                  <div className='d-flex justify-content-between align-items-center'>
                     <Link to='/register'>not Registed ? Here to register</Link>
                     <Button htmlType='submit' type='primary'>
                        Login
                     </Button>
                  </div>
               </Form>
            </Col>
         </Row>
      </div>
   );
};

export default Login;
