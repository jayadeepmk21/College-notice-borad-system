const db = require('../config/database');

const createNotice = async (req, res) => {
  try {
    const { title, content, department, date } = req.body;
    const admin_id = req.admin.id;

    const [result] = await db.execute(
      'INSERT INTO notices (title, content, department, date, admin_id) VALUES (?, ?, ?, ?, ?)',
      [title, content, department, date, admin_id]
    );

    res.status(201).json({
      message: 'Notice created successfully',
      notice: {
        id: result.insertId,
        title,
        content,
        department,
        date
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getNotices = async (req, res) => {
  try {
    const { department, date } = req.query;
    let query = `
      SELECT n.*, a.name as admin_name 
      FROM notices n 
      LEFT JOIN admins a ON n.admin_id = a.id
      WHERE 1=1
    `;
    const params = [];

    if (department && department !== 'all') {
      query += ' AND n.department = ?';
      params.push(department);
    }

    if (date) {
      query += ' AND n.date = ?';
      params.push(date);
    }

    query += ' ORDER BY n.created_at DESC';

    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, department, date } = req.body;

    await db.execute(
      'UPDATE notices SET title = ?, content = ?, department = ?, date = ? WHERE id = ?',
      [title, content, department, date, id]
    );

    res.json({ message: 'Notice updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute('DELETE FROM notices WHERE id = ?', [id]);
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createNotice,
  getNotices,
  updateNotice,
  deleteNotice
};