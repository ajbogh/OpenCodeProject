const Logger = {
  log: (message, data=null) => {
    if(!data) {
      console.log(message)
    } else {
      console.log(message, data);
    }
  }
}

module.exports = Logger;
