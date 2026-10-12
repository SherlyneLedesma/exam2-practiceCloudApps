const db = require("../config/db");

const Order = {
  // Create
  async addOrder(orderData) {
    const { orderDesc, quantity, unitCost } = orderData;
    const sql = `INSERT INTO orders (orderDesc, quantity, unitCost) VALUES (?, ?, ?)`;
    const [result] = await db.execute(sql, [orderDesc, quantity, unitCost]);
    return result.insertId;
  },

  // Read All
  async getOrders() {
    const sql = `SELECT orderID, orderDesc, quantity, unitCost, created FROM orders`;
    const [rows] = await db.execute(sql);
    return rows;
  },

  // Read One by ID
  async getOrderById(id) {
    const sql = `SELECT orderID, orderDesc, quantity, unitCost, created FROM orders WHERE orderID = ?`;
    const [rows] = await db.execute(sql, [id]);
    return rows[0] || null;
  },

  // UPDATE - Modify an existing entry by its Primary Key
  async updateOrder(id, orderData) {
    const { orderDesc, quantity, unitCost } = orderData;
    const sql = `UPDATE orders SET orderDesc = ?, quantity = ?, unitCost = ? WHERE orderID = ?`;
    const [result] = await db.execute(sql, [orderDesc, quantity, unitCost, id]);
    return result.affectedRows > 0;
  },

  // DELETE - Remove an entry from the database schema entirely
  async deleteOrder(id) {
    const sql = `DELETE FROM orders WHERE orderID = ?`;
    const [result] = await db.execute(sql, [id]);
    return result.affectedRows > 0;
  }

};

module.exports = Order;
