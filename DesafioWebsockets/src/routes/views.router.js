import { Router } from "express";
import ProductManager from "../productManager.js";


const router = Router()
const productManager = new ProductManager()

router.get('/', (req, res) => {
    res.render('index', {})
})

router.get('/products', async (req, res) => {
    const products = await productManager.getProducts()
    res.render('products', { products })
})

router.get('/products-realtime', async (req, res) => {
    const products = await productManager.getProducts()
    res.render('realTimeProducts', { products })
})

router.get('/form-products', async (req, res) => {
    res.render('form', {})
})

router.post('/form-products', async (req, res) => {
    const { title, description, price, thumbnail, stock } = req.body;
    // Validate the request body
    if (!title || !description || !price || !thumbnail || !stock) {
        res.status(400).send('All fields are required');
        return;
    }

    const result = await productManager.addProduct({title, description, price, thumbnail, stock});
    console.log(result);
    res.redirect('/products');
});

export default router