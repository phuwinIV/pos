import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import {
   MenuUnfoldOutlined,
   MenuFoldOutlined,
   UserOutlined,
   HomeOutlined,
   CopyOutlined,
   UnorderedListOutlined,
   LoginOutlined,
   ShoppingCartOutlined,

} from '@ant-design/icons';
import '../resourses/layout.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { logout } from '../actions/userActions';
import Order from './Order';
const { Header, Sider, Content } = Layout;

const DefaultLayout = (props) => {
   const location = useLocation();
   const navigate = useNavigate();
   const [collapsed, setCollapsed] = useState(false);

   const cart = useSelector((state) => state.cart);
   const { cartItems } = cart;

   const dispatch = useDispatch();

   const toggle = () => {
      setCollapsed(!collapsed);
   };

   useEffect(() => {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
   }, [cartItems]);

   const logoutHandler = () => {
      dispatch(logout());
      navigate('/login');
   };

   return (
      <Layout>
         <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className='logo'>
               <h3>{collapsed ? 'POS' : ' POS'}</h3>
            </div>
            <Menu
               theme='dark'
               mode='inline'
               defaultSelectedKeys={window.location.pathname}>
               <Menu.Item key='/' icon={<HomeOutlined />}>
                  <Link to='/'>Home</Link>
               </Menu.Item>
               <Menu.Item key='/bills' icon={<CopyOutlined />}>
                  <Link to='/bills'>Bills</Link>
               </Menu.Item>
               <Menu.Item key='/items' icon={<UnorderedListOutlined />}>
                  <Link to='/items'>Items</Link>
               </Menu.Item>
               <Menu.Item key='/customer' icon={<UserOutlined />}>
                  <Link to='/employee'>Employee</Link>
               </Menu.Item>
               <Menu.Item
                  key='/logout'
                  icon={<LoginOutlined />}
                  onClick={logoutHandler}>
                  Logout
               </Menu.Item>
            </Menu>
         </Sider>
         <Layout className='site-layout'>
            <Header className='site-layout-background' style={{ padding: 10 }}>
               {React.createElement(
                  collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                  {
                     className: 'trigger',
                     onClick: toggle,
                  }
               )}
               <div
                  className='cart-count d-flex align-items-center'
                  onClick={() => navigate('/cart')}>
                  <p className='mt-3 mr-2'>{cartItems.length}</p>
                  <ShoppingCartOutlined />
               </div>
            </Header>
            <div className='d-flex'>
               {' '}
               <Content
                  className='site-layout-background'
                  style={{
                     margin: '10px',
                     padding: 24,
                     minHeight: '80vh',
                  }}>
                  {props.children}
               </Content>
               {location.pathname === '/' && (
                  <Content className='site-layout-background-right'>
                     <Order />
                  </Content>
               )}
            </div>
         </Layout>
      </Layout>
   );
};

export default DefaultLayout;
