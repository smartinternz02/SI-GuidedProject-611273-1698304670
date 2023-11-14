import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import firebase from 'firebase/app';
import 'firebase/database';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const ExcelToFirebase = () => {
  const [jsonData, setJsonData] = useState(null);

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet_name = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheet_name];
      const dataJson = XLSX.utils.sheet_to_json(worksheet);
      setJsonData(dataJson);
    };
    reader.readAsArrayBuffer(file);
  };

  const uploadToFirebase = () => {
    if (jsonData) {
      database.ref('excelData').set(jsonData)
        .then(() => {
          console.log('Data uploaded to Firebase!');
        })
        .catch((error) => {
          console.error('Error uploading data:', error);
        });
    } else {
      console.error('No data to upload.');
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleFile(e.target.files[0])} />
      <button onClick={uploadToFirebase}>Upload to Firebase</button>
    </div>
  );
};

export default ExcelToFirebase;
