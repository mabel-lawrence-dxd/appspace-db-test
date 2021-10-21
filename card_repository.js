class CardRpository {
  constructor(dao) {
    this.dao = dao;
  }
  createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employeeName TEXT,
        headshot VARCHAR,
        description TEXT,
        yearEarned INTEGER,
        quote TEXT)`;
    return this.dao.run(sql);
  }

  clearRows() {
    const sql = `DELETE FROM cards`;
    return this.dao.run(sql);
  }

  resetIncrement(){
    return this.dao.run(`DELETE FROM sqlite_sequence WHERE name='cards'`);
}

  create(employeeName, headshot, description, yearEarned, quote) {
    return this.dao.run(
      `INSERT INTO cards (employeeName, headshot, description, yearEarned, quote) VALUES (?,?,?,?,?)`,
      [employeeName, headshot, description, yearEarned, quote]
    );
  }

  update(employee) {
    const { employeeName, headshot, description, yearEarned, quote } = employee;
    return this.dao.run(
      `UPDATE cards SET
          employeeName=?,
          headshot=?,
          description = ?,
          yearEarned = ?,
          quote = ?
          WHERE id = ?`,
      [employeeName, headshot, description, yearEarned, quote, id]
    );
  }

  delete(id) {
    return this.dao.run(`DELETE FROM cards WHERE id = ?`, [id]);
  }

  getById(id) {
    return this.dao.get(`SELECT * FROM cards WHERE id = ?`, [id]);
  }

  getByName(employeeName) {
    return this.dao.get(`SELECT * FROM cards WHERE employeeName = ?`, [employeeName]);
  }

  getEmployees() {
    return this.dao.all(`SELECT * FROM cards`);
  }
}

module.exports = CardRpository;
