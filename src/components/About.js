import React, { useState, useEffect } from 'react';
import '../style/About.css';
import { FaLine , FaPhoneSquareAlt  } from "react-icons/fa";

export default function About() {
  const [QRCodeImages, setQRCodeImages] = useState([]);

  useEffect(() => {
    const imageFileNames = [
      { fileName: '1.jpg', message: '1. กดเข้าสู่ระบบ' },
      { fileName: '2.jpg', message: '2. เข้าสู่ระบบ' },
      { fileName: '3.jpg', message: '3. สมัครบัญชีผู้ใช้' },
      { fileName: '4.jpg', message: '4. เพิ่มสินค้าเข้าตะกร้า' },
      { fileName: '5.jpg', message: '5. สั่งซื้อสินค้า' },
      { fileName: '6.jpg', message: '6. ชำระเงิน' },
      { fileName: '7.jpg', message: '7. ยืนยันการโอนเงินและติดตามสินค้า' },
      { fileName: '8.jpg', message: '8. ขั้นตอนการตรวจสอบสลิปผ่าน Linebot' },
      { fileName: '9.jpg', message: '9. ติดตามสินค้าและรับสินค้า' },
    ];

    const fetchImages = async () => {
      const fetchedImages = await Promise.all(imageFileNames.map(async (fileInfo) => {
        const response = await fetch(`http://chaibwoot.no-ip.org:4452/uploads/${fileInfo.fileName}`);
        const blob = await response.blob();
        return { imageUrl: URL.createObjectURL(blob), message: fileInfo.message };
      }));
      setQRCodeImages(fetchedImages);
    };

    fetchImages();
  }, []);

  return (
    <div className="App-HOR">
      <main className="main-HOR">
        <h1 className="title">How to order</h1>
        <div className="products-HOR">
          {QRCodeImages.map((imageInfo, index) => (
            <div key={index}>
              <h3>{imageInfo.message}</h3>
              <img className="order-image" src={imageInfo.imageUrl} alt={imageInfo.message} />
            </div>
          ))}
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
