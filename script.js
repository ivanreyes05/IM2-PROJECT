 // Import the functions you need from the SDKs
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
 import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
 import * as XLSX from "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.11.7/xlsx.full.min.js";
 
 // Your Firebase configuration
 const firebaseConfig = {
   apiKey: "AIzaSyD3JYh51oQDxHPXPkj2r3Z-B50QsNUeibA",
   authDomain: "im2-project-2910d.firebaseapp.com",
   databaseURL: "https://im2-project-2910d-default-rtdb.firebaseio.com",
   projectId: "im2-project-2910d",
   storageBucket: "im2-project-2910d.appspot.com",
   messagingSenderId: "635251213594",
   appId: "1:635251213594:web:5312fd0c5d096d727a98a3"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const db = getDatabase(app);

 document.addEventListener('DOMContentLoaded', () => {
   document.getElementById("submit").addEventListener('click', async function(e) {
     e.preventDefault();

     const username = document.getElementById("username").value;
     const email = document.getElementById("email").value;
     const phoneNumber = document.getElementById("number").value;
     const date = document.getElementById("date").value;

     try {
       await set(ref(db, `users/${username}-${Date.now()}`), {
         username,
         email,
         phoneNumber,
         date
       });
       alert("Data saved successfully!");
     } catch (error) {
       console.error("Error saving data:", error);
     }
   });

   document.getElementById("download").addEventListener("click", async () => {
     try {
       const snapshot = await get(ref(db, 'users'));
       const membersData = snapshot.val();

       if (membersData) {
         const data = [['Username', 'Email', 'Phone Number', 'Date']];
         for (const key in membersData) {
           const member = membersData[key];
           if (member) {
             data.push([
               member.username || 'N/A',
               member.email || 'N/A',
               member.phoneNumber || 'N/A',
               member.date || 'N/A'
             ]);
           }
         }

         const ws = XLSX.utils.aoa_to_sheet(data); // Create a worksheet from the array of arrays
         const wb = XLSX.utils.book_new(); // Create a new workbook
         XLSX.utils.book_append_sheet(wb, ws, 'Members'); // Append the worksheet to the workbook

         XLSX.writeFile(wb, 'media_team_data.xlsx'); // Download the file
       } else {
         alert("No data available");
       }
     } catch (error) {
       console.error("Error fetching data:", error);
       alert(`An error occurred while fetching data: ${error.message}`);
     }
   });
 });