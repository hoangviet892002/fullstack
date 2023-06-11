const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Doctor = require('../models/doctor');
const Admin = require('../models/admin');

const UserController = {
  register: async (req, res) => {
    try {
      const { email, password, fullname, address, phone, gender, confirmPassword } = req.body;

      // Kiểm tra xem email đã được sử dụng chưa
      // Kiểm tra email và mật khẩu
      const doctor = await Doctor.findOne({ where: { email } });
      const admin = await Admin.findOne({ where: { email } });
      const customer = await Customer.findOne({ where: { email } });
      
      if (doctor || admin || customer) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Kiểm tra mật khẩu và xác nhận mật khẩu khớp nhau
      if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
      }

      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tạo người dùng mới
      await Customer.create({
        email,
        password: hashedPassword,
        fullname,
        address,
        phone,
        gender,
      });

      // Trả về kết quả thành công
      return res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
      // Xử lý lỗi
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Kiểm tra xem email đã được sử dụng chưa
      // Kiểm tra email và mật khẩu trong bảng Customer
      const customer = await Customer.findOne({ where: { email } });

      // Kiểm tra email và mật khẩu trong bảng Doctor
      const doctor = await Doctor.findOne({ where: { email } });

      // Kiểm tra email và mật khẩu trong bảng Admin
      const admin = await Admin.findOne({ where: { email } });

      // Kiểm tra xem người dùng có tồn tại không
      const user = customer || doctor || admin;

      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      // Kiểm tra mật khẩu
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid password' });
      }

      // Tạo JSON Web Token (JWT)
      const token = jwt.sign({ id: user.id, email: user.email }, 'your-secret-key', { expiresIn: '1h' });

      // Trả về kết quả thành công và token
      return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      // Xử lý lỗi
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
  


};

module.exports = UserController;
