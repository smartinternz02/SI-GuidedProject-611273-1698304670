import React, { useState } from 'react';

const ImageInput = () => {
  const [selectedImage, setSelectedImage] = useState(null);

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

      // Replace 'https://potato-leaf-disease-detect-api-production.up.railway.app/predict' with your endpoint URL
      fetch('https://potato-leaf-disease-detect-api-production.up.railway.app/predict', {
        method: 'POST',
        body: formData,
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Network response was not ok.');
        })
        .then(data => {
          console.log('Image uploaded successfully:', data);
          // Handle the response data as needed
        })
        .catch(error => {
          console.error('Error uploading image:', error);
          // Handle the error
        });
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {selectedImage && (
        <div>
          <h2>Selected Image:</h2>
          <img src={selectedImage} alt="Selected" style={{ maxWidth: '300px' }} />
        </div>
      )}
    </div>
  );
};

export default ImageInput;
