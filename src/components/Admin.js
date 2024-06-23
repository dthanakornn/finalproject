import React, { useState, useEffect } from 'react';
import '../style/Admin.css';
import { TextField } from '@mui/material';

export default function Admin() {
  const [successProducts, setSuccessProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const iduser = localStorage.getItem('iduser');
    const usertype = localStorage.getItem('usertype');
    if (usertype !== 'admin')
    {
      window.location ='/'
      alert('คุณไม่สามารถเข้าหน้านี้ได้')
    }
    fetch('http://chaibwoot.no-ip.org:4452/authen', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'ok') {
          localStorage.setItem('token', token);
          localStorage.setItem('id_user', iduser);
          localStorage.setItem('usertype', usertype);
        } else {
          alert('Authen Failed');
          localStorage.removeItem('token');
          window.location = '/login';
        }
        console.log('Success: ', data);
      })
      .catch((error) => {
        console.log('Error', error);
      });

    fetch(`http://chaibwoot.no-ip.org:4452/checkingorder`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data, 'data')
        const uniqueOrders = data.filter((item, index, self) => self.findIndex(t => t.order_id === item.order_id) === index);
        setSuccessProducts(uniqueOrders);
      })
      .catch((error) => console.error("Error fetching order data:", error));
  }, []);

  const handleSubmit = async (event, index) => {
    event.preventDefault();

    const updatedData = {
      total_price: event.target.total_price.value,
      total_amount: event.target.total_amount.value,
      order_id: successProducts[index].order_id // ใช้ order_id ของรายการที่ถูกแก้ไข
    };
    
    try {
      const response = await fetch('http://chaibwoot.no-ip.org:4452/updateorder', {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        window.location = '/admin';
      } else {
        console.error('Update failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };



  return (
    <div className="App-admin">
      <main className="main-admin">
        <h1 className="title-admin">Checking Order</h1>
        <div className="products-admin">
          {successProducts.map((item, index) => (
            item.status !== "success" && (
              <div className="product-admin" key={`success_product_${index}`}>
                <form className='form-admin' onSubmit={(e) => handleSubmit(e, index)}>
                  <p>ชื่อ : {item.fname} {item.lname}</p>
                  <p>ยอดเงินที่ต้องโอน : {item.total_price}</p>
                  <TextField
                      required
                      id={`total_price_${index}`}
                      name="total_price"
                      autoComplete="off"
                      value={item.total_price} // กำหนดค่าเริ่มต้นให้ TextField
                  />
                  <p>ยอดเงินที่ได้รับ : {item.total_amount}</p>
                  {item.total_amount < item.total_price && (
                    <>
                      <p style={{ color: 'red' }}>*ลูกค้าโอนเงินไม่ครบ*</p>
                    </>
                  )}
                  {item.total_amount > item.total_price && (
                    <>
                      <p style={{ color: 'red' }}>*ลูกค้าโอนเงินเกิน*</p>
                    </>
                  )}
                  <TextField
                      required
                      id={`total_amount_${index}`}
                      name="total_amount"
                      autoComplete="off"
                      defaultValue={item.total_amount} // กำหนดค่าเริ่มต้นให้ TextField
                  />
                  <p>รหัสคำสั่งซื้อ : {item.order_id}</p>
                  <p>สถานะการสั่งซื้อ : {item.status}</p>
                  <button className="btn checkout-btn" type="submit">Edit</button>
                </form>
              </div>
            )
          ))}
        </div>
      </main>
    </div>
  );
}



