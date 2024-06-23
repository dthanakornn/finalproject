import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../style/CheckOutitem.css';

function Shop() {
  const [products, setProductsFromAPI] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const iduser = localStorage.getItem('iduser');

    // Authenticate user
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
        } else {
          alert('Authentication Failed');
          localStorage.removeItem('token');
          window.location = '/login';
        }
        console.log('Authentication Success:', data);
      })
      .catch((error) => {
        console.log('Error during authentication:', error);
      });

    // Fetch cart items
    fetch(`http://chaibwoot.no-ip.org:4452/cart?id_user=${iduser}`)
      .then((response) => response.json())
      .then((data) => {
        setProductsFromAPI(data);
        calculateTotalPrice(data);
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      });

      // ใน useEffect ของ React component
      fetch('http://chaibwoot.no-ip.org:4452/getQRCode')  
      .then(response => response.json())
      .then(data => {
      // ดึงชื่อไฟล์รูปภาพจากข้อมูลที่ได้
      const fileName = data.fileName;

      // สร้าง URL สำหรับแสดงรูปภาพ
      const imageUrl = `http://chaibwoot.no-ip.org:4452/uploads/${fileName}`;  
      // เปลี่ยนเป็น imageUrl ที่ได้จาก API

      // ตั้งค่า URL ใน state เพื่อแสดงรูปภาพในหน้าแสดงผล
      setImageUrl(imageUrl);
      })
      .catch(error => {
      console.error('Error fetching image:', error);
      });
  }, []);

  const calculateTotalPrice = (cartProducts) => {
    let total = 0;
    cartProducts.forEach((product) => {
      total += product.item_price * product.order_count;
    });
    setTotalPrice(total);
  }

  const checkOutItem = () => {
    const iduser = localStorage.getItem('iduser');
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // เพิ่ม 1 เนื่องจากเดือนเริ่มที่ 0
    const year = currentDate.getFullYear();
    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMonth = month < 10 ? '0' + month : month;
    const formattedDate = `${year}${formattedMonth}${formattedDay}`;
    const randomNumber = Math.floor(Math.random() * 1000); // สุ่มเลข 3 หลัก
    const updateData = {
      id_user: iduser,
    };
    // Fetch checkout for the entire cart
    fetch(`http://chaibwoot.no-ip.org:4452/checkoutitemorder/${iduser}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Checkout for entire cart:", data);
      })
      .catch(error => console.error('Error during cart checkout:', error));
  
    // eslint-disable-next-line array-callback-return
    const checkoutPromises = products.map((item) => {
      const updateDataItem = {
        item_amount: item.order_count,
        id_item: item.id_item
      };

      console.log(updateDataItem,'updateDataItem22');
      // ตรวจสอบว่ามีการเรียก fetch หรือไม่
      console.log('Calling fetch for checkoutitem');
      fetch(`http://chaibwoot.no-ip.org:4452/checkoutitem`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateDataItem),
      })
        .then(response => response.json())
        .then(data => {
          console.log("Checkout for item:", item, data);
        })
        .catch(error => console.error('Error during item checkout:', item, error));
    });

    const addCheckoutPromises = products.map((item) => {
      const updateDCheckOut = {
        id_user: iduser,
        total_price: totalPrice,
        status: 'waiting',
        id_item: item.id_item,
        order_id: `BBD-${formattedDate}-${randomNumber.toString().padStart(3, '0')}`,
        order_count: item.order_count
      };

      fetch(`http://chaibwoot.no-ip.org:4452/addcheckout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateDCheckOut),
      })
        .then(response => response.json())
        .then(data => {
          console.log("Checkout for item:", item, data);
        })
        .catch(error => console.error('Error during item checkout:', item, error));
    });
   

    Promise.all(checkoutPromises && addCheckoutPromises)
      .then(() => {
        navigate('/orderhistory'); // กำหนด path ของ component ที่ต้องการไป
        alert("ซื้อสินค้าเรียบร้อยแล้ว");
      })
      .catch(error => console.error('Error during checkout:', error));
  };
  

  return (
    <div className="App-checkout">
      <main className="main-checkout">
        <h2 className="title-checkout">Checkout</h2>
        <div className="products-checkout">
          {imageUrl && <img className="product-image" src={imageUrl} alt="Uploaded" />}
        </div>
        <div className="total-price">
          <span>Total: {totalPrice} ฿</span>
        </div>
        <button className="btn checkout-btn-checkout" onClick={checkOutItem}>
          Proceed to checkout
        </button>   
      </main>
    </div>
  );
  
}

export default Shop;
