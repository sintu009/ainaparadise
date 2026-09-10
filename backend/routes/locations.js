const router = require('express').Router();
const pool = require('../db');
const { auth, adminOnly } = require('../middleware/auth');

// Public: get all active locations
router.get('/', async (req, res) => {
  try {
    const query = req.query.all === 'true'
      ? 'SELECT * FROM locations ORDER BY state, city, name'
      : 'SELECT * FROM locations WHERE is_active=true ORDER BY state, city, name';
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM locations WHERE id=$1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Location not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, adminOnly, async (req, res) => {
  const { name, city, state, description } = req.body;
  if (!name || !city || !state) return res.status(400).json({ message: 'name, city, state required' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO locations (name,city,state,description) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, city, state, description || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, adminOnly, async (req, res) => {
  const { name, city, state, description, is_active } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE locations SET name=$1,city=$2,state=$3,description=$4,is_active=$5 WHERE id=$6 RETURNING *',
      [name, city, state, description || null, is_active ?? true, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Location not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await pool.query('DELETE FROM locations WHERE id=$1', [req.params.id]);
    res.json({ message: 'Location deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
