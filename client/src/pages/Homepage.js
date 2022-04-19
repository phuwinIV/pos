import { Col, Row, Spin, message } from 'antd';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';
import DefaultLayout from '../components/DefaultLayout';
import Item from '../components/Item';
import '../resourses/items.css';

const Homepage = () => {
   const [selectedCategory, setSelectedCategory] = useState('coffee');

   const dispatch = useDispatch();

   const productList = useSelector((state) => state.productList);
   const { loading, error, products } = productList;

   const categories = [
      {
         name: 'coffee',
         imageURL:
            'https://images.unsplash.com/photo-1599163479506-2758dab1dd5e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Y29mZmVlJTIwY3Vwc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      },
      {
         name: 'dessert',
         imageURL:
            'https://media.istockphoto.com/photos/yogurt-with-granola-berry-fruits-and-chocolate-picture-id959868924?b=1&k=20&m=959868924&s=170667a&w=0&h=yESgsGFd7uU_OyXWTLeoADmw7py5Jy17x7F0NiELMSs=',
      },
      {
         name: 'food',
         imageURL:
            'https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzN8fGZvb2R8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
      },
   ];

   const errorMsg = () => {
      message.error(error);
   };

   useEffect(() => {
      dispatch(listProducts());
   }, [dispatch]);

   return (
      <DefaultLayout>
         {error && errorMsg()}
         <div className='d-flex categories '>
            {categories.map((category) => {
               return (
                  <div
                     onClick={() => setSelectedCategory(category.name)}
                     className={`d-flex category ${
                        selectedCategory === category.name &&
                        `selected-category`
                     } `}>
                     <h4> {category.name} </h4>
                     <img
                        src={category.imageURL}
                        style={{
                           objectFit: 'cover',
                           width: 100,
                           height: 60,
                        }}
                        alt=''
                     />
                  </div>
               );
            })}
         </div>

         {loading ? (
            <Spin
               style={{
                  width: '100px',
                  height: '100px',
                  margin: 'auto',
                  display: 'block',
               }}
               size='large'
            />
         ) : error ? (
            <h1>No product</h1>
         ) : (
            <Row gutter={20}>
               {products
                  .filter((i) => i.category === selectedCategory)
                  .map((product) => {
                     return (
                        <Col key={product._id} xs={24} lg={6} md={12} sm={6}>
                           <Item product={product} />
                        </Col>
                     );
                  })}
            </Row>
         )}
      </DefaultLayout>
   );
};

export default Homepage;
