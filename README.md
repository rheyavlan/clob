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
> node server.js

Command to run app : 
> npm start

Command to test app : 
> npm test

You will be redirected to http://localhost:3000/

Click on **Process Trade** to process all the tradespresent in order.txt file in the data directory

![image](https://user-images.githubusercontent.com/16959405/151089689-1deb70be-a537-46d4-963c-2e8ca0dc5561.png)


You can make POST request and add additional orders :

![image](https://user-images.githubusercontent.com/16959405/151090135-1a856506-47c3-4b1d-b8b3-0c5851da3542.png)

Flow of the project :

![image](https://user-images.githubusercontent.com/16959405/151090791-a94444a2-8edf-403b-9a1e-bda8b5eb0869.png)


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
