# Backend Setup Instructions

The "Failed to connect to server" error happens because your React app cannot find the PHP backend files. XAMPP only serves files that are inside its `htdocs` folder.

## Step 1: Move Backend Files to XAMPP
1.  Navigate to your XAMPP installation folder (usually `C:\xampp\htdocs`).
2.  Create a new folder named `bank-portal`.
3.  Copy the **entire** `backend` folder from your project (`c:\Users\apbah\Desktop\Web Dev Lab\Project\bank-portal\backend`) and paste it into `C:\xampp\htdocs\bank-portal\`.

**Your XAMPP folder structure should look like this:**
```
C:\xampp\htdocs\
  └── bank-portal\
      └── backend\
          ├── db.php
          ├── login.php
          └── database.sql
```

## Step 2: Import Database
1.  Start **Apache** and **MySQL** in the XAMPP Control Panel.
2.  Go to [http://localhost/phpmyadmin](http://localhost/phpmyadmin) in your browser.
3.  Click **New** on the left sidebar.
4.  Create a database named `bank_portal`.
5.  Click on the new `bank_portal` database.
6.  Click the **Import** tab at the top.
7.  Choose the file `database.sql` (you can find it in the `backend` folder you just copied).
8.  Click **Import** at the bottom.

## Step 3: Verify Backend is Running
1.  Open your browser and visit: [http://localhost/bank-portal/backend/login.php](http://localhost/bank-portal/backend/login.php)
2.  You should see a JSON response like:
    ```json
    {"status":"error","message":"Incomplete data"}
    ```
    *If you see this, the backend is working!*
    *If you see "Not Found", check your folder structure in Step 1.*

## Step 4: Login
1.  Go back to your React app (`http://localhost:5173`).
2.  Login with:
    *   **User ID:** `alex123`
    *   **Password:** `password123`
