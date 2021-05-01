const db = require('./connect');

async function getCategories() {
  return new Promise((resolve, reject) => {
    db.query({
      sql: 'SELECT DISTINCT(`category`), COUNT(`category`) as count FROM posts GROUP BY category ORDER BY category',
    }, (error, results, fields) => {
      if(error) {
        reject(error);
        return;
      }

      resolve(results);
    });
  });
}

async function getPostsForCategory (category, sortBy='created_datetime', order='ASC', limit=10, page=0) {
  const count = getPostsCount(category);

  const posts = new Promise((resolve, reject) => {
    db.query({
      sql: `SELECT posts.id as id, title, author, display_name, created_datetime, category, markdown FROM posts, users WHERE category=? AND posts.author=users.id ORDER BY ? ${db.escape(order).replace(/\'/g, '')} LIMIT ? OFFSET ?`,
      values: [
        category, 
        sortBy, 
        limit, 
        page * limit
      ]
    }, (error, results, fields) => {
      if(error) {
        reject(error);
        return;
      }

      resolve(results);
    });
  });

  const resolved = await Promise.all([posts, count]);
  const response = {
    posts: [...resolved[0]],
    total: resolved[1].total,
  }

  return response;
}

async function getPostsCount(category) {
  return new Promise((resolve, reject) => {
    db.query({
      sql: `SELECT COUNT(id) as total FROM posts WHERE category=?`,
      values: [
        category
      ]
    }, (error, results, fields) => {
      if(error) {
        reject(error);
        return;
      }

      resolve(results[0]);
    });
  });
}

async function getPost(id) {
  return new Promise((resolve, reject) => {
    db.query({
      sql: `SELECT posts.id as id, title, author, display_name, created_datetime, category, markdown FROM posts, users WHERE posts.id=? and posts.author=users.id`,
      values: [
        id
      ]
    }, (error, results, fields) => {
      if(error) {
        reject(error);
        return;
      }

      if(results.length > 0) {
        resolve(results[0]);
        return;
      }

      reject(`Post with id ${id} not found`);
    });
  });
}

module.exports = {
  getCategories,
  getPost,
  getPostsForCategory,
  getPostsCount,
};