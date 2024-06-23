/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { AiFillCloseCircle } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";

function UpdateItem({
  itemvisibilty,
  onClose,
}) {
  const [products, setProductsFromAPI] = useState([]);
  const [productImages, setProductImages] = useState({});
  const [updatedQuantities, setUpdatedQuantities] = useState({});


  const FetchData = () => {
    fetch("http://chaibwoot.no-ip.org:4452/getitems")
  .then((response) => response.json())
  .then((data) => {
    setProductsFromAPI(data);
    // เพิ่มการเรียก API ดึงข้อมูลรูปภาพ โดยให้มี id_item เป็น parameter
    data.forEach(item => {
      fetch(`http://chaibwoot.no-ip.org:4452/getImage/${item.id_item}`)
        .then(response => response.json())
        .then(imageData => {
          // ดึงชื่อไฟล์รูปภาพจากข้อมูลที่ได้
          const fileName = imageData.fileName;

          // สร้าง URL สำหรับแสดงรูปภาพ
          const imageUrl = `http://chaibwoot.no-ip.org:4452/uploads/${fileName}`; 

          // อัพเดท state ของรูปภาพสินค้า
          setProductImages(prevState => ({ ...prevState, [item.id_item]: imageUrl }));
        })
        .catch(error => {
          console.error('Error fetching image:', error);
        });
    });
  })
  .catch((error) => console.error("Error fetching products:", error));
  }

  const onAdminRemoveProduct = (item) => {
    fetch(`http://chaibwoot.no-ip.org:4452/admindeleteitem/${item.id_item}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(response => response.json())
      .then((data) => data.status === "success" ? FetchData() : console.log(data))
      .catch((error) => {
        console.log('Error', error);
      });
  };

  const adminupdateitem = (productId, count) => {
    setUpdatedQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productId]: count,
      }));
    const updateData = {
      id_item: productId,
      item_amount: count,
    };
    
    fetch(`http://chaibwoot.no-ip.org:4452/adminupdateitem/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => console.error('Error:', error));
  };

  const updateProducts = () => {
    window.location = '/';
  }

  useEffect(() => {
    FetchData();
  }, [itemvisibilty, updatedQuantities]);

  return (
    <div
      className="modal"
      style={{
        display: itemvisibilty
          ? "block"
          : "none",
      }}>
      <div className="shoppingCart">
        <div className="header">
          <h2>Update Produsts</h2>
          <button
            className="btn close-btn"
            onClick={onClose}>
            <AiFillCloseCircle
              size={30}
            />
          </button>
        </div>
        <div className="cart-products">
          {products.length === 0 ? (
            <span className="empty-text">
              Your basket is
              currently empty
            </span>
          ) : products.map((item) => (
            <div
              className="cart-product"
              key={item.id_item}>
              {productImages[item.id_item] && <img src={productImages[item.id_item]} alt="Product" />}
              <div className="product-info">
                <h3>
                  {item.item_name}
                </h3>
                <span className="product-price">
                  สินค้าเหลือ : {item.item_amount}
                </span>
              </div>
              <select
                className="count"
                value={item.count}
                onChange={(event) => {
                  adminupdateitem(
                    item.id_item,
                    event.target.value
                  );
                }}>
                {[...Array(100).keys(),].map((number) => {
                  const num = number + 1;
                  return (
                    <option
                      value={num}
                      key={num}>{num}
                    </option>
                  );
                }
                )}
              </select>
              <button className="btn remove-btn" onClick={() => onAdminRemoveProduct(item)}>
                <RiDeleteBin6Line size={20} />
              </button>
            </div>
            ))}
            <button className="btn checkout-btn" onClick={updateProducts}>
                Update Products Amount
            </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateItem;
