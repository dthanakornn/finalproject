import React, { useState, useEffect } from "react";
import "../style/Shipping.css";

function OrderHistory() {
  const [successProducts, setSuccessProducts] = useState([]);
  const [successProductImages, setSuccessProductImages] = useState({});

  useEffect(() => {

    const fetchProductImages = async () => {
      try {
        const successResponse = await fetch(`http://chaibwoot.no-ip.org:4452/getorder`);
        const successData = await successResponse.json();

        const successImagePromises = successData.map(async (item) => {
          const imageResponse = await fetch(`http://chaibwoot.no-ip.org:4452/getImage/${item.id_item}`);
          const imageData = await imageResponse.json();
          const fileName = imageData.fileName;
          const imageUrl = `http://chaibwoot.no-ip.org:4452/uploads/${fileName}`;
          return { itemIdPrice: `${item.id_item}_${item.item_price}`, imageUrl };
        });

        const resolvedSuccessImages = await Promise.all(successImagePromises);

        const successImageObject = resolvedSuccessImages.reduce((acc, curr) => {
          acc[curr.itemIdPrice] = curr.imageUrl;
          return acc;
        }, {});

        setSuccessProductImages(successImageObject);
        setSuccessProducts(successData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProductImages();
  }, []);

  return (
    <div className="App">
      <main className="main-shop">
        <div className="success-products">
          <h2 className="title">Products that need to be shipped</h2>
          <div className="products-shipping">
            {successProducts.map((item) => (
              <div className="product-shipping" key={`success_product_${item.id_item}`}>
                {successProductImages[`${item.id_item}_${item.item_price}`] && <img src={successProductImages[`${item.id_item}_${item.item_price}`]} alt="Product" />}
                <p>ชื่อ : {item.fname} {item.lname}</p>
                <p>ที่อยู่ : {item.address}</p>
                <p>เบอร์โทร : {item.telephone}</p>
                <p>ราคาสินค้ารวม : {item.total_price}</p>
                <p className="product-amount">จำนวนสินค้า : {item.order_count}</p>
                <p className="product-status">สถานะการสั่งซื้อ : {item.status}</p>
                <p className="product-orderid">รหัสคำสั่งซื้อ : <br/>{item.order_id}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrderHistory;
