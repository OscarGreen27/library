A simple web application library that runs on node.js using typescript and express
## Technology
  - Node.js
  - TypeScript
  - Express

## How to start
1. Clone the repository
   - git clone https://github.com/OscarGreen27/library.git
2. Install dependencies
   - npm install
3. Restore the backup database (backup folder in the project root)
   I used MariaDB as a database. It is also worth creating a new database user with full rights.
4. Create a .env file
   The project uses the following variable environments
   //server configuration 
      SERVER_PORT=the port on which it will be launched node.js

   //db configuration
      DB_HOST=database host
      DB_NAME=database name(lib)
      DB_USER=database username
      DB_PASS=database user password
5. Сompile files
   - tsc
     AND
   - tsc -p tsconfig.scripts.json (separately for frontend scripts)
6. Launch
   - node dist/index.js or npm start

