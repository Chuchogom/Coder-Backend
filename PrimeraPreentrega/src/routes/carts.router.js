import { Router } from "express";
import CartManager from "../cartManager.js";

const router = Router()

const cartManager = new CartManager()

//Get all the carts
router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit
        if (limit) {
            const carts = await cartManager.getCarts()
            res.json(carts.slice(0, limit))
        } else {
            const carts = await cartManager.getCarts()
            res.json(carts)
        }
    } catch (error) {
        console.error(error)
        res.status(500).send(error.message)
    }
})

//Add new cart
router.post('/', async (req, res) => {
    try {
        const productIds = req.body.productIds;
        if (!productIds || !Array.isArray(productIds)) {
            res.status(400).send('productIds is required and must be an array');
            return;
        }
        const cartId = await cartManager.addCart(productIds);
        res.json({ id: cartId });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

// Get the products in a cart
router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const carts = await cartManager.getCarts();
        const cart = carts.find((cart) => cart.id == cartId);
        if (!cart) {
            res.status(404).send('Cart not found');
            return;
        }
        res.json(cart.products);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

// Add a product to a cart
router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
        const carts = await cartManager.getCarts();
        const cartIndex = carts.findIndex((cart) => cart.id == cartId);
        if (cartIndex === -1) {
            res.status(404).send('Cart not found');
            return;
        }
        const productIndex = carts[cartIndex].products.findIndex(
            (product) => product.product == productId
        );
        if (productIndex === -1) {
            // If the product is not already in the cart, add it
            carts[cartIndex].products.push({ product: productId, quantity: 1 });
        } else {
            // If the product is already in the cart, increment its quantity
            carts[cartIndex].products[productIndex].quantity++;
        }
        await cartManager.saveCartsToFile();
        res.json({ status: 'success', message: 'Product added to cart' });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});



export default router