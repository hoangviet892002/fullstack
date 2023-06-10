const userRoutes = require('./userRoutes')

const router = (App) => {
    App.use('/api', userRoutes)
} 
module.exports = routes