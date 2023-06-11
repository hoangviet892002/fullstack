const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const db = require('./database');
const cors = require('cors');

// Kết nối cơ sở dữ liệu
db.authenticate()
  .then(() => {
    console.log('Kết nối cơ sở dữ liệu thành công');
  })
  .catch((err) => {
    console.error('Lỗi kết nối cơ sở dữ liệu:', err);
  });

// Middleware
app.use(express.json());
app.use(cors()); // Thêm middleware cors vào ứng dụng


// Routes
app.use('/api', userRoutes);

// Cổng lắng nghe
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server đang lắng nghe trên cổng ${port}`);
});
