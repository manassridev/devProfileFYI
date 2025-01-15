const { LocalStorage } = require("node-localstorage");
const localStorage = new LocalStorage("./scratch");
const myLocalStorage = () => {
  const currentTime = new Date().getTime();
  return {
    setItem: (key, value, timer) => {
      const item = {
        value: value,
        expiryTime: timer + currentTime,
      };
      localStorage.setItem(key, JSON.stringify(item));
    },
    getItem: (key) => {
      const items = JSON.parse(localStorage.getItem(key));
      if (items.expiryTime < currentTime) {
        localStorage.removeItem(key);
        return null;
      }
    },
  };
};
module.exports = myLocalStorage;
