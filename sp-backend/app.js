const authRoutes = require('./routes/auth.route');
const detectorRoutes = require('./routes/detector.route');
const scanRoutes = require('./routes/scan.route');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/detector', detectorRoutes);
app.use('/api/scan', scanRoutes); 