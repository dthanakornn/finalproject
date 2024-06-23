import React, { useState, useEffect } from "react";
import "../style/main.css";
import ShoppingCart from "./cart/ShoppingCart";
import UpdateItem from "./UpdateItem";
import { FaLine , FaPhoneSquareAlt  } from "react-icons/fa";

const usertype = localStorage.getItem('usertype')

function Shop() {
  const [cartsVisibility, setCartVisible] = useState(false);
  const [itemsVisibility, setItemsVisibility] = useState(false);
  const [products, setProductsFromAPI] = useState([]);
  const [updatedPrice, setUpdatedPrice] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [productImages, setProductImages] = useState({});

  useEffect(() => {
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
  }, []);

  const checkItemInCart = (item) => {
    const iduser = localStorage.getItem('iduser');
    fetch(`http://chaibwoot.no-ip.org:4452/cart?id_user=${iduser}`)
      .then((response) => response.json())
      .then((data) => {
        const isItemInCart = data.some(cartItem => cartItem.id_item === item.id_item);
        if (isItemInCart) {
          alert("คุณมีสินค้านี้ในตะกร้าแล้ว");
        } else {
          addProductToCart(item);
        }
      })
      .catch((error) => console.error("Error fetching cart:", error));
  };
  

  const addProductToCart = (item) => {
    const iduser = localStorage.getItem('iduser')
    const jsonData = {
      id_item: item.id_item,
      order_count: 1,
      item_price: item.item_price,
      id_user: iduser,
      status: "order" 
    };

    fetch('http://chaibwoot.no-ip.org:4452/order',{
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    })
    .then(response => response.json())
    .then(jsonData =>{
      console.log('Success: ', jsonData)
      setShowPopup(true); 
      document.getElementById.innerHTML = jsonData;
    })
    .catch((error) => {
      console.log('Error', error)
    });
  };

  
  const onQuantityChange = (productId, count) => {
    const iduser = localStorage.getItem('iduser');
    const updateData = {
      id_item: productId,
      id_user: iduser,
      order_count: count,
    };
    
    fetch(`http://chaibwoot.no-ip.org:4452/updateitem/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setUpdatedPrice(prevValue => !prevValue);
      })
      .catch(error => console.error('Error:', error));
  };
  
  
  const onProductRemove = (item) => {
    fetch(`http://chaibwoot.no-ip.org:4452/deleteitem/${item.id_item}/${item.id_user}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(response => response.json())
      .then((data) => {console.log(data);})
      .catch((error) => {
        console.log('Error', error);
      });
  };
  
  const closePopup = () => {
    setShowPopup(false);
  };

  const onOpenUpdateItem = () => {
    setItemsVisibility(true);
  };

  return (
    <div className="App">
      <ShoppingCart
        visibilty={cartsVisibility}
        onClose={() => setCartVisible(false)}
        onQuantityChange={onQuantityChange}
        onProductRemove={onProductRemove}
        updatedPrice={updatedPrice}
      />
      <UpdateItem
        itemvisibilty={itemsVisibility}
        onClose={() => setItemsVisibility(false)}
      />
      {showPopup && (
        <div className="popup">
          <p>Item added to cart!</p>
          <button onClick={closePopup}> Close </button>
        </div>
      )}
      <main className="main-shop">
        <h2 className="title">Products</h2>
        <div className="products">
          {products.map((item) => (
            <div className="product" key={`product_${item.id_item}`}>
              {productImages[item.id_item] && <img src={productImages[item.id_item]} alt="Product" />}
              <h4 className="product-name">{item.item_name}</h4>
              {item.item_amount === 0 && (
              <>
                <p>จำนวนสินค้า : สินค้าหมด</p>
              </>
              )}
              {item.item_amount > 0 && (
              <>
                <p>จำนวนสินค้า : {item.item_amount}</p>
              </>
              )}
              <span className="product-price">{item.item_price} ฿</span>
              <div className="buttons">
                {item.item_amount > 0 && (
                <>
                  <button className="btn" onClick={() => usertype ? checkItemInCart(item) : alert("Please login to add to cart")}>
                    Add to cart
                  </button>
                </>
                )}
                {usertype === 'admin' && (
                <>
                  <button className="btn" onClick={onOpenUpdateItem}>
                    Update Item
                  </button>
                </>
                )}
              </div>
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

export default Shop;