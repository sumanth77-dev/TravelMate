const db = require('../config/db');

const Destination = {
  findAll: async () => {
    const query = `SELECT * FROM destinations`;
    const [rows] = await db.query(query);
    return rows;
  }
};

module.exports = Destination;
