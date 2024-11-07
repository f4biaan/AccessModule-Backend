const express = require('express');
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');
const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
