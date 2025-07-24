HI, THIS IS GROUP 5 DEMO PROJECT, KHANH CREATED THIS DEMO BECAUSE KHANH HAS SOME TROUBLES CONNECTING 
THE BACKEND THO (ONLY KHANH THO:>)

BACKEND SETUP:
1. Install Python, pip, mysql ()
2. Connect to the feenix-maria.swin.edu.au with Cisco Anyconnect
3. Create database table (can create in myphpadmin or vscode its ok)
  //product db
   CREATE TABLE product (
   id INT AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   price FLOAT,
   currency,
   img LONGTEXT ,
   description,
   category,
   quantity,
   assetType,
   owner,
   tradeable,
   tokenId
   contractAddress,
   creator,
   )
  //with the user db
   CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
  );
4. Create file .env and change the db connecting information
   DB_USERNAME=
   DB_PASSWORD=
   DB_HOSTNAME=feenix-mariadb.swin.edu.au
   DB_NAME=
5. Vscode -> run pip install -r requirements.txt
6. ..
7. Run the backend: uvicorn main:app --reload
8. API docs FastAPI: http://localhost:8000/docs


       
