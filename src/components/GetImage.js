import React, { useEffect, useState } from 'react';

function DisplayImage() {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
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

  return (
    <div>
      <h2>Display Image</h2>
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  );
}

export default DisplayImage;
