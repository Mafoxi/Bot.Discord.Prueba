const db = new sqlite3.Database("database.sqlite3");

const table = `CREATE TABLE balance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  balance INTEGER NOT NULL
);`;

await db.run(table);

async function addBalance(user_id, balance) {
  const sql = `INSERT INTO balance (user_id, balance) VALUES ($1, $2);`;
  await db.run(sql, user_id, balance);
}

async function getBalance(user_id) {
  const sql = `SELECT balance FROM balance WHERE user_id = $1;`;
  const row = await db.get(sql, user_id);
  return row.balance;
}

async function updateBalance(user_id, balance) {
  const sql = `UPDATE balance SET balance = $2 WHERE user_id = $1;`;
  await db.run(sql, user_id, balance);
}

async function deleteBalance(user_id) {
  const sql = `DELETE FROM balance WHERE user_id = $1;`;
  await db.run(sql, user_id);
}

module.exports = {
  addBalance,
  getBalance,
  updateBalance,
  deleteBalance
};
