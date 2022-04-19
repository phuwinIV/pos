import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Card, Modal } from 'antd';
import { addToCart } from '../actions/cartAction';
import { Radio } from 'antd';
import { Form } from 'antd';

const Items = ({ product }) => {
   const [quantity, setQty] = useState(1);
   const [desc, setDesc] = useState({ sweetRate: '', CoffeBeen: '' });
   const [modalOpen, setModalOpen] = useState(false);
   const [selectedItem, setSelectedItem] = useState('');
   const dispatch = useDispatch();

   const { Meta } = Card;

   const onChange1 = (e) => {
      setDesc({ sweetRate: e.target.value });
      setDesc({ CoffeBeen: e.target.value });
      console.log(desc);
   };

   const increaseQuantity = (quantity) => {
      // eslint-disable-next-line no-const-assign
      setQty(quantity + 1);
      dispatch(addToCart(product._id, quantity));
   };

   return (
      <>
         <br />
         <div className='d-flex'>
            <Card
               onClick={() => increaseQuantity(quantity)}
               size='big'
               hoverable
               style={{ width: 240 }}
               cover={
                  <img
                     alt='example'
                     style={{ height: 200, objectFit: 'cover' }}
                     src={product.image}
                  />
               }>
               <Meta title={product.name} description={product.price} />
            </Card>
         </div>

         <Modal
            title={
               <>
                  {' '}
                  <h5 style={{ textAlign: 'center' }}>
                     {' '}
                     {selectedItem.name}{' '}
                  </h5>{' '}
               </>
            }
            visible={modalOpen}
            onCancel={() => setModalOpen(false)}
            footer={
               <Button
                  htmlType='submit'
                  type='primary'
                  style={{ width: '100%' }}>
                  {' '}
                  บันทึก{' '}
               </Button>
            }>
            <div style={{ width: '80%' }}>
               <Form.Item label='ระดับความหวาน'>
                  <Radio.Group onChange={onChange1} style={{ width: '100%' }}>
                     <Radio.Button value='หวานน้อย' className='mr-5'>
                        หวานน้อย
                     </Radio.Button>
                     <Radio.Button value='เพิ่มหวาน' className='mr-5'>
                        เพิ่มหวาน
                     </Radio.Button>
                     <Radio.Button value='ไม่หวาน'> ไม่หวาน </Radio.Button>
                  </Radio.Group>
               </Form.Item>

               <Form.Item label='เมล็ดกาแฟ'>
                  <Radio.Group onChange={onChange1}>
                     <Radio.Button value='คั่วอ่อน' className='mr-5'>
                        คั่วอ่อน
                     </Radio.Button>
                     <Radio.Button value='คั่วกลาง' className='mr-5'>
                        คั่วกลาง
                     </Radio.Button>
                     <Radio.Button value='คั่วเข้ม'> คั่วเข้ม </Radio.Button>
                  </Radio.Group>
               </Form.Item>
               <Button
                  htmlType='submit'
                  type='primary'
                  style={{ width: '100%' }}>
                  {' '}
                  บันทึก{' '}
               </Button>
            </div>
         </Modal>
      </>
   );
};

export default Items;
