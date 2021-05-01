// Rename this file to `secrets.js` and modify on the server. 
// Do not add secrets.js to git or remove it from the .gitignore file.

const secrets = {
  githubWebHook: 'githubsecret',
  mysql: {
    host     : 'localhost',
    user     : 'me',
    password : 'secret',
    database : 'my_db'
  }
};

module.exports = secrets;
