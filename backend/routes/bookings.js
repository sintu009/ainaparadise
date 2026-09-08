const router = require('express').Router();
const pool = require('../db');
const { auth, adminOnly } = require('../middleware/auth');

// Create booking — users book for themselves, admins can book on behalf of guests
router.post('/', auth, async (req, res) => {
  const { room_id, check_in, check_out, adults, kids, guest_name, guest_email, guest_phone, special_requests } = req.body;
  if (!room_id || !check_in || !check_out) return res.status(400).json({ message: 'room_id, check_in, check_out required' });
  if (!guest_name || !guest_email) return res.status(400).json({ message: 'guest_name and guest_email required' });
  try {
    const conflict = await pool.query(
      `SELECT id FROM bookings WHERE room_id=$1 AND status NOT IN ('cancelled')
       AND (check_in, check_out) OVERLAPS ($2::date, $3::date)`,
      [room_id, check_in, check_out]
    );
    if (conflict.rows.length) return res.status(409).json({ message: 'Room not available for selected dates' });

    const room = await pool.query('SELECT price FROM rooms WHERE id=$1', [room_id]);
    if (!room.rows.length) return res.status(404).json({ message: 'Room not found' });

    const nights = Math.ceil((new Date(check_out) - new Date(check_in)) / (1000 * 60 * 60 * 24));
    const total_price = nights * room.rows[0].price;
    // Admin bookings: status auto-confirmed; user bookings: pending
    const status = req.user.role === 'admin' ? 'confirmed' : 'pending';
    const user_id = req.user.role === 'admin' ? null : req.user.id;

    const { rows } = await pool.query(
      `INSERT INTO bookings (user_id,room_id,check_in,check_out,adults,kids,total_price,guest_name,guest_email,guest_phone,special_requests,status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [user_id, room_id, check_in, check_out, adults || 1, kids || 0, total_price, guest_name, guest_email, guest_phone, special_requests, status]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current user's bookings
router.get('/my', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT b.*, r.name as room_name, r.image_url FROM bookings b
       LEFT JOIN rooms r ON b.room_id=r.id
       WHERE b.user_id=$1 ORDER BY b.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: get all bookings
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT b.*, r.name as room_name, u.name as user_name, u.email as user_email
       FROM bookings b
       LEFT JOIN rooms r ON b.room_id=r.id
       LEFT JOIN users u ON b.user_id=u.id
       ORDER BY b.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: update booking status
router.patch('/:id/status', auth, adminOnly, async (req, res) => {
  const { status } = req.body;
  const valid = ['pending', 'confirmed', 'cancelled', 'completed'];
  if (!valid.includes(status)) return res.status(400).json({ message: 'Invalid status' });
  try {
    const { rows } = await pool.query(
      'UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *',
      [status, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Booking not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel own booking
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'UPDATE bookings SET status=$1 WHERE id=$2 AND user_id=$3 RETURNING *',
      ['cancelled', req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Booking not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: dashboard stats
router.get('/admin/stats', auth, adminOnly, async (req, res) => {
  try {
    const [bookings, revenue, rooms, users] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM bookings WHERE status != 'cancelled'"),
      pool.query("SELECT COALESCE(SUM(total_price),0) as total FROM bookings WHERE status='confirmed' OR status='completed'"),
      pool.query('SELECT COUNT(*) FROM rooms'),
      pool.query("SELECT COUNT(*) FROM users WHERE role='user'"),
    ]);
    res.json({
      totalBookings: parseInt(bookings.rows[0].count),
      totalRevenue: parseFloat(revenue.rows[0].total),
      totalRooms: parseInt(rooms.rows[0].count),
      totalUsers: parseInt(users.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
