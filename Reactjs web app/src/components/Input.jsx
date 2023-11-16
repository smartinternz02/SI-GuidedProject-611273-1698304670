import React, { useState } from 'react';
import "./index.css"

const ImageInput = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [data, setData] = useState([]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setSelectedImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('image_f', file);

      fetch('https://potato-leaf-disease.onrender.com/predict', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((responseData) => {
          if (Array.isArray(responseData)) {
            const updatedData = responseData.map((item) => ({
              ...item,
              model_pred: item.model_pred.replace(/_/g, ' '), // Replace underscores with spaces
            }));
            setData(updatedData);
          } else {
            const updatedResponseData = {
              ...responseData,
              model_pred: responseData.model_pred.replace(/_/g, ' '), // Replace underscores with spaces
            };
            setData([updatedResponseData]); // Wrap non-array response in an array
          }
        })
        .catch((error) => {
          console.error('Error uploading image:', error);
        });
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {selectedImage && (
        <div className='selected-image-container'>
          <h2>Selected Image:</h2>
          <img src={selectedImage} alt="Selected" style={{ maxWidth: '300px' }} />
        </div>
      )}
      {data.map((item, index) => (
        <p key={index}>{item.model_pred}</p>
      ))}
    </div>
  );
};

export default ImageInput;
