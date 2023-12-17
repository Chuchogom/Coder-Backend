import express from 'express'
import __dirname from './utils.js'
import {Server, Socket} from 'socket.io'
import handlebars from 'express-handlebars'
import viewsRouter from './routes/views.router.js'
import productRouter from './routes/products.router.js'
import ProductManager from './productManager.js'
import cartRouter from './routes/carts.router.js'

const app = express()

//Template Engine
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/static', express.static(__dirname + '/public'))

//Routes
app.use('/', viewsRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

//Servers
const PORT = process.env.PORT || 8080
const httpServer = app.listen(PORT, () => console.log(`Listenning on port...${PORT}`))
const io = new Server(httpServer)

//Websockets
io.on('connection', socket => {
    socket.on('new-product', async data => {
        console.log(data);
        const productManager = new ProductManager()
        await productManager.addProduct(data)

        const products = await productManager.getProducts()
        socket.emit('reload-table', products)
        console.log(products)
    })
})