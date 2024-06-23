import React, { useState , useEffect } from 'react';
import '../style/Addproducts.css'

function AddProducts() {
  const [file, setFile] = useState(null);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productQuantity, setProductQuantity] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token')
    const iduser = localStorage.getItem('iduser')
    const usertype = localStorage.getItem('usertype')
    if (usertype !== 'admin')
    {
      window.location ='/'
      alert('คุณไม่สามารถเข้าหน้านี้ได้')
    }
    fetch('http://chaibwoot.no-ip.org:4452/authen', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer '+ token
      }
    })
    .then(response => response.json())
    .then(data =>{
      if(data.status === 'ok'){
        localStorage.setItem('token', token)
        localStorage.setItem('id_user', iduser)
        localStorage.setItem('usertype', usertype)
      }else{
        alert('Authen Failed')
        localStorage.removeItem('token');
        window.location ='/login'
      }
      console.log('Success: ', data)
    })
    .catch((error) => {
      console.log('Error', error)
    });
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleProductNameChange = (event) => {
    setProductName(event.target.value);
  };

  const handleProductPriceChange = (event) => {
    setProductPrice(event.target.value);
  };

  const handleProductQuantityChange = (event) => {
    setProductQuantity(event.target.value);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file', file);
  
    fetch('http://chaibwoot.no-ip.org:4452/upload', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(uploadData => {
      console.log('Upload success:', uploadData);
  
      // Handle additional steps after file upload, if needed
      const jsonData = {
        item_name: productName,
        item_price: productPrice,
        item_amount: productQuantity,
        item_image: uploadData.filename, // Use the filename from the uploadData
      };
  
      // Send product data to another endpoint
      return fetch('http://chaibwoot.no-ip.org:4452/addproducts', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'ok') {
        alert('Add products success');
      } else {
        alert('Add products failed');
      }
      console.log('Success: ', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };
  

  return (
    <div className='addproduct'>
      <div className='item-addproduct'>
        <input type="text" placeholder="Product Name" value={productName} onChange={handleProductNameChange} />
        <input type="text" placeholder="Product Price" value={productPrice} onChange={handleProductPriceChange} />
        <input type="text" placeholder="Product Quantity" value={productQuantity} onChange={handleProductQuantityChange} />
      </div>
      <div className='uploadimage'>
        <input type="file" onChange={handleFileChange}/>
      </div>
      <button onClick={handleUpload} className='btn-addproduct'>Add Products</button>
    </div>
  );
}

export default AddProducts;
