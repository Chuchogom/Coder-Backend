import express from 'express'
import productRouter from './routes/products.router.js'
import cartRouter from './routes/carts.router.js'

const app = express()
const port = 8080


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/static', express.static('./src/public'))

//Routes
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)


//Server
app.listen(port, ()=> {console.log(`Server listening on port ${port}`)})