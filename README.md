# Central Limit Order Book (CLOB)


It accepts orders via a REST API and publishes updates on order book state changes or if trades occur.

![trade](https://user-images.githubusercontent.com/16959405/151068897-f05ff466-c359-48cb-bcd3-a978509c841d.jpeg)


Clone or download this repository
git clone [Github](https://github.com/rheyavlan/clob)
Install dependencies
```
npm install
```

Command for server (Run this command if you only want to run the server): 
```
node server.js
```

Command to run app : 
```
npm start
```

Command to test app : 
```
npm test
```

> You will be redirected to http://localhost:3000/

Click on **Process Trades** to process all the trades present in order.txt file in the data directory 

> Process Trades

You can choose to process any trade file but changing the file in server.js


![image](https://user-images.githubusercontent.com/16959405/151089689-1deb70be-a537-46d4-963c-2e8ca0dc5561.png)


You can make POST request and add additional orders : A file watcher is implemented which triggers as soon as the POST
API appends data to the text file. 


![image](https://user-images.githubusercontent.com/16959405/151090135-1a856506-47c3-4b1d-b8b3-0c5851da3542.png)


Flow of the project :


![image](https://user-images.githubusercontent.com/16959405/151090791-a94444a2-8edf-403b-9a1e-bda8b5eb0869.png)


Sample Console Output :


![image](https://user-images.githubusercontent.com/16959405/151224014-2c22c782-4d20-4ae8-8a8e-bd2d41a1b5c1.png)


Sample Test Cases Executed :


![image](https://user-images.githubusercontent.com/16959405/151224329-e5fd1065-8b62-4927-b453-8ab303796464.png)




**Technologies and Tools used:**

Front-end
- React js
- jquery 
- react-scripts

Back-end
- Express
- Node js
- js-priority-queue
- clone
- body-parser

Testing
- Mocha
- Chai
- Chai-http
- mocha-junit-reporter

License
- MIT
