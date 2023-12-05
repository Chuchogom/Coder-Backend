import express from 'express';
import ProductManager from './src/productManager.js';

const app = express()
app.use(express.json())
const productManager = new ProductManager()

// Homepage
app.get('/', (req,res) => {
    res.send('Welcome Homepage')
})

// Get all th products
app.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit
        if (limit) {
            const products = await productManager.getProducts()
            res.json(products.slice(0, limit))
        } else {
            const products = await productManager.getProducts()
            res.json(products)
        }
    } catch (error) {
        console.error(error)
        res.status(500).send(error.message)
    }
})

//Add a new product
app.post('/products', async (req, res) => {
    try {
        const { title, description, price, thumbnail, stock } = req.body
        await productManager.addProduct(
            title, description, price, thumbnail, stock
        )
        res.json({ status: 'success', message: 'Product added succesfully' })
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message)
    }
})

//Get a product by id
app.get('products/:id', async (req,res)=>{
    const productId = req.params.id
    try {
        const product =  await productManager.getProductById(productId)
        res.send(product)   
    } catch (error) {
        console.error(error)
        res.status(500).send(error.message)
    }
})

//Update a product by id
app.put('/products/:id', async (req, res) => {
    const productId = req.params.id
    const updatedProduct = req.body
    try {
        await productManager.updateProduct(productId, updatedProduct)
        res.json({status: 'success', message: 'Product updated successfully'})
    } catch (error) {
        console.error(error)
        res.status(500).send(error.message)
    }
})

//Delete a product by id
app.delete('/products/:id', async (req, res) => {
    const productId = Number(req.params.id)
    try {
        await productManager.deleteProduct(productId)
        res.json({status: 'success', message: 'Product deleted successfully'})
    } catch (error) {
        console.error(error)
        res.status(500).send(error.message)
    }
})


//Server
const port = 8080;
app.listen(8080, () => console.log(`Server running on port ${port}`))