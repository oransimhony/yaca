# yaca

⌨️ Yet Another Chat App 📱

A small chat app built with [React Native](https://github.com/facebook/react-native), [Expo](https://github.com/expo/expo), [Pusher Chatkit](https://github.com/pusher/chatkit-client-js) and [Gifted Chat](https://github.com/FaridSafi/react-native-gifted-chat).

## Installation 👩‍💻👨‍💻

Clone the repo

```sh
git clone https://github.com/oransimhony/yaca.git
```

Change directory

```sh
cd yaca
```

## Running 🚀

### Adding config files ⚙️

You need to add two files: `config.json` in `yaca-app/screens/` and `variables.env` in `yaca-server/`.

I will work you through the files' structure right now.

#### variables.env 📄

```sh
PORT=5000
CHATKIT_INSTANCE_LOCATOR=XX:XXX:XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
CHATKIT_SECRET_KEY=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

`PORT`: The port in which the server will run, if you change this remember to change it in the app as well.

`CHATKIT_INSTACE_LOCATOR` and `CHATKIT_SECRET_KEY`: Insert the according values from your [Pusher Chatkit Dashboard](https://dash.pusher.com/chatkit)

#### config.json 📄

```json
{
  "CHATKIT_INSTANCE_LOCATOR": "XX:XXX:XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  "ip": "XXX.XXX.XXX.XXX"
}
```

`CHATKIT_INSTACE_LOCATOR`: Insert the according value from your [Pusher Chatkit Dashboard](https://dash.pusher.com/chatkit)

`ip`: Insert the ip in which your server runs, **don't include the port just the ip**

**REMEMBER TO PLACE THE FILES IN THE CORRECT LOCATIONS OR THIS WILL NOT WORK**

### Running the app

Enter the app directory

```sh
cd yaca-app
```

Install the dependencies using your preferred manager

```sh
npm install
```

```sh
yarn install
```

Start the project using your preferred manager

```sh
npm start
```

```sh
yarn start
```

### Running the server

Enter the server directory

```sh
cd yaca-server
```

Install the dependencies using your preferred manager

```sh
npm install
```

```sh
yarn install
```

Start the project using your preferred manager

```sh
npm start
```

```sh
yarn start
```

And now you are ready to go! 🔥

Enjoy 🎉