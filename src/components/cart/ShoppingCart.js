/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { AiFillCloseCircle } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import '../../style/shoppingCart.css';

function ShoppingCart({
  visibilty,
  onClose,
  onQuantityChange,
  updatedPrice,
}) {
  const [products, setProductsFromAPI] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [productImages, setProductImages] = useState({});

  const onProductRemove = (item) => {
    fetch(`http://chaibwoot.no-ip.org:4452/deleteitem/${item.id_item}/${item.id_user}`, {
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

  const FetchData = () => {
    const iduser = localStorage.getItem('iduser')
    fetch(`http://chaibwoot.no-ip.org:4452/cart?id_user=${iduser}`)
      .then((response) => response.json())
      .then((data) => {
        setProductsFromAPI(data);
        calculateTotalPrice(data);
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
      }, localStorage.setItem('iduser', iduser))
      .catch((error) => console.error("Error fetching products:", error));
  }

  const calculateTotalPrice = (cartProducts) => {
    let total = 0;
    cartProducts.forEach((product) => {
      total += product.item_price * product.order_count;
    });
    setTotalPrice(total);
  }

  const navigate = useNavigate();
  const goCheckOut = () => {
    navigate('/checkoutitem'); // กำหนด path ของ component ที่ต้องการไป
    onClose();
  }

  useEffect(() => {
    FetchData();
  }, [updatedPrice, visibilty]);

  return (
    <div
      className="modal"
      style={{
        display: visibilty
          ? "block"
          : "none",
      }}>
      <div className="shoppingCart">
        <div className="header">
          <h2>Shopping cart</h2>
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
                  {item.item_price * item.order_count} ฿
                </span>
              </div>
              <select
                className="count"
                value={item.count}
                onChange={(event) => {
                  onQuantityChange(
                    item.id_item,
                    event.target.value
                  );
                }}>
                {[...Array(item.item_amount).keys()].map((number) => {
                  const num = number + 1;
                  return (
                    <option
                      value={num}
                      key={num}>{num}
                    </option>
                  );
                })}
              </select>
              <button
                className="btn remove-btn"
                onClick={() => onProductRemove(item)}>
                <RiDeleteBin6Line size={20} />
              </button>
            </div>
          ))}

          {products.length > 0 && (
            <div className="total-price">
              <span>Total: {totalPrice} ฿</span>
              <button className="btn checkout-btn" onClick={goCheckOut}>
                Proceed to checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
