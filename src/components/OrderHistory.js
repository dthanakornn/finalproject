import React, { useState, useEffect } from "react";
import { FaLine , FaPhoneSquareAlt  } from "react-icons/fa";

function OrderHistory() {
  const [waitingProducts, setWaitingProducts] = useState([]);
  const [waitingProductImages, setWaitingProductImages] = useState({});
  const [shippingProducts, setShippingProducts] = useState([]);
  const [shippingProductImages, setShippingProductImages] = useState({});

  useEffect(() => {
    const iduser = localStorage.getItem('iduser');
    fetchProductImages(iduser);
  }, []);

  const fetchProductImages = async (iduser) => {
    try {
      setShippingProducts([]);
      const waitingResponse = await fetch(`http://chaibwoot.no-ip.org:4452/getwaitingcheckout?id_user=${iduser}`);
      const shippingResponse = await fetch(`http://chaibwoot.no-ip.org:4452/getshippingcheckout?id_user=${iduser}`);
      const waitingData = await waitingResponse.json();
      const shippingData = await shippingResponse.json();

      const waitingImagePromises = waitingData.map(async (item) => {
        const imageResponse = await fetch(`http://chaibwoot.no-ip.org:4452/getImage/${item.id_item}`);
        const imageData = await imageResponse.json();
        const fileName = imageData.fileName;
        const imageUrl = `http://chaibwoot.no-ip.org:4452/uploads/${fileName}`;
        return { itemIdPrice: `${item.id_item}_${item.item_price}`, imageUrl };
      });

      const shippingImagePromises = shippingData.map(async (item) => {
        const imageResponse = await fetch(`http://chaibwoot.no-ip.org:4452/getImage/${item.id_item}`);
        const imageData = await imageResponse.json();
        const fileName = imageData.fileName;
        const imageUrl = `http://chaibwoot.no-ip.org:4452/uploads/${fileName}`;
        return { itemIdPrice: `${item.id_item}_${item.item_price}`, imageUrl };
      });

      const resolvedWaitingImages = await Promise.all(waitingImagePromises);
      const resolvedSuccessImages = await Promise.all(shippingImagePromises);

      const waitingImageObject = resolvedWaitingImages.reduce((acc, curr) => {
        acc[curr.itemIdPrice] = curr.imageUrl;
        return acc;
      }, {});

      const shippingImageObject = resolvedSuccessImages.reduce((acc, curr) => {
        acc[curr.itemIdPrice] = curr.imageUrl;
        return acc;
      }, {});

      setWaitingProductImages(waitingImageObject);
      setWaitingProducts(waitingData);
      setShippingProductImages(shippingImageObject);
      setShippingProducts(shippingData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateStatus = async (item) => {
    try {
      const response = await fetch(`http://chaibwoot.no-ip.org:4452/updatestatusproduct`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_item: item.id_item, order_id: item.order_id })
      });
  
      if (response.ok) {
        // ลบ item ที่ถูกกดออกจาก shippingProducts โดยไม่ต้องใช้ repage
        setShippingProducts(prevShippingProducts =>
          prevShippingProducts.filter(product => !(product.id_item === item.id_item && product.order_id === item.order_id))
        );
      } else {
        console.error('Error updating status:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  
  
  
  return (
    <div className="App">
      <main className="main-shop">
        <div className="waiting-products">
          <h2 className="title">Waiting for payment</h2>
          <div className="products">
            {waitingProducts.map((item) => (
              <div className="product" key={`waiting_product_${item.id_item}`}>
                {waitingProductImages[`${item.id_item}_${item.item_price}`] && <img src={waitingProductImages[`${item.id_item}_${item.item_price}`]} alt="Product" />}
                <p>ราคารวม : {item.total_price}</p>
                <p className="product-amount">จำนวนสินค้า : {item.order_count}</p>
                <p className="product-status">สถานะการสั่งซื้อ : {item.status}</p>
                <p className="product-orderid">รหัสคำสั่งซื้อ : <br/>{item.order_id}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="success-products">
          <h2 className="title">Payment successful</h2>
          <div className="products">
            {shippingProducts.map((item) => (
              <div className="product" key={`success_product_${item.id_item}`}>
                {shippingProductImages[`${item.id_item}_${item.item_price}`] && <img src={shippingProductImages[`${item.id_item}_${item.item_price}`]} alt="Product" />}
                <p>ราคาสินค้ารวม : {item.total_price}</p>
                <p className="product-amount">จำนวนสินค้า : {item.order_count}</p>
                <p className="product-status">สถานะการสั่งซื้อ : {item.status}</p>
                <p className="product-orderid">รหัสคำสั่งซื้อ : <br/>{item.order_id}</p>
                <button className="btn checkout-btn" onClick={() => updateStatus(item)} style={{ color: 'white' }}>
                  Get Product
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="questionnaire">
        <h3 style={{ color: 'black', marginTop: '35px' }}>ซื้อเสร็จแล้วรบกวนทำแบบสอบถามหน่อยนะค้าา</h3>  
        <a href="https://forms.gle/b6439zckWSZruL7Y6" style={{ color: 'var(--main-color)' }}>
          ลิงก์ไปยัง Google forms
        </a>
        </div>
        <div className="contact-icons">
          <FaLine style={{ color: '#06C755', transform: 'scale(2.2)' }} />
          <h3 style={{ color: 'black' }}> Bow-sp </h3>
          <a href="http://chaibwoot.no-ip.org:4452/uploads/QRCodeLinebot.png" style={{ color: 'black' }}>
            <FaLine style={{ color: '#06C755', transform: 'scale(2.2)' }} />  
          </a>
          <a href="http://chaibwoot.no-ip.org:4452/uploads/QRCodeLinebot.png" style={{ color: 'black' }}>
            <h3 style={{ color: 'black' }}>Line Bot Bobady</h3>
          </a>
          <FaPhoneSquareAlt style={{ transform: 'scale(2.2)' }} />
          <h3>083-526-1533</h3>
        </div>
      </main>
    </div>
  );
}

export default OrderHistory;
