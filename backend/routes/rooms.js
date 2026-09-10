const router = require('express').Router();
const pool = require('../db');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { all, location_id } = req.query;
    let query = `SELECT r.*, l.name as location_name, l.city as location_city, l.state as location_state
                 FROM rooms r LEFT JOIN locations l ON r.location_id = l.id`;
    const params = [];
    const conditions = [];
    if (all !== 'true') conditions.push('r.is_available=true');
    if (location_id) { params.push(location_id); conditions.push(`r.location_id=$${params.length}`); }
    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY r.id';
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT r.*, l.name as location_name, l.city as location_city, l.state as location_state
       FROM rooms r LEFT JOIN locations l ON r.location_id = l.id WHERE r.id=$1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Room not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, adminOnly, async (req, res) => {
  const { name, description, size, max_person, price, image_url, image_lg_url, facilities, images, location_id } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO rooms (name,description,size,max_person,price,image_url,image_lg_url,facilities,images,location_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
      [name, description, size, max_person, price, image_url, image_lg_url, facilities, images || [], location_id || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, adminOnly, async (req, res) => {
  const { name, description, size, max_person, price, image_url, image_lg_url, facilities, is_available, images, location_id } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE rooms SET name=$1,description=$2,size=$3,max_person=$4,price=$5,image_url=$6,image_lg_url=$7,facilities=$8,is_available=$9,images=$10,location_id=$11 WHERE id=$12 RETURNING *',
      [name, description, size, max_person, price, image_url, image_lg_url, facilities, is_available, images || [], location_id || null, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Room not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await pool.query('DELETE FROM rooms WHERE id=$1', [req.params.id]);
    res.json({ message: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
