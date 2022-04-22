import React, { useEffect } from 'react';
import '../resourses/authentication.css';
import { Form, Input, Button, Row, Col, Spin, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../actions/userActions';
import '../resourses/items.css';

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
         {loading && <Spin className='loader'></Spin>}
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
                     <Input status={error && 'error'} />
                  </Form.Item>

                  <Form.Item name='password' label='Password'>
                     <Input.Password
                        iconRender={(visible) =>
                           visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                        status={error && 'error'}
                     />
                  </Form.Item>

                  <Button htmlType='submit' type='primary' block>
                     Login
                  </Button>
               </Form>
            </Col>
         </Row>
      </div>
   );
};

export default Login;
