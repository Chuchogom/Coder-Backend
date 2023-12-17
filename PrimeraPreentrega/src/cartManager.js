import fs from 'fs'
import ProductManager from './productManager.js'

class CartManager extends ProductManager {
    constructor(path) {
        super()
        this.path = path
        this.carts = []
        this.productManager = new ProductManager();
    }

    getCarts = async () => {
        await this.loadCartsFromFile()
        return this.carts
    }

    //Search a cart by id
    cartId = async () => {
        await this.loadCartsFromFile()
        const count = this.carts.length
        const nextId = (count > 0) ? this.carts[count - 1].id + 1 : 1
        return nextId
    }

    //Add a new cart
    addCart = async (productIds) => {
        try {
            await this.loadCartsFromFile()
            const id = Number(await this.cartId())
            const code = `CRT-${id}`;

            // Get the products from the ProductManager
            const products = await Promise.all(productIds.map(async (productId) => {
                const product = await this.productManager.getProductById(productId);
                return product;
            }));

            const cart = {
                id,
                products,
                code: `CRT-${id}`,
            }

            // Check if all parameters are defined
            if (
                id === undefined ||
                products === undefined ||
                code === undefined
            ) {
                throw new Error('All arguments are required')
            }

            // Check if the code already exists
            const cartWithSameCode = this.carts.find((cart) => cart.code === code)
            if (cartWithSameCode) {
                throw new Error('The code already exists')
            }

            // Check if any of the variables are empty
            if (id === '' || products === '' || code === '') {
                throw new Error('All arguments must be non-empty')
            }
            //Add the cart to the array
            this.carts.push(cart)
            //Save the cart in the json file
            this.saveCartsToFile()
            return id
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async loadCartsFromFile() {
        try {
            // Check if the file exists
            if (!fs.existsSync('carts.json')) {
                // If it doesn't exist, create an empty file
                await fs.promises.writeFile('carts.json', '[]');
            }
            const cartsJson = await fs.promises.readFile('carts.json', 'utf-8');
            if (!cartsJson) {
                return [];
            }
            const carts = JSON.parse(cartsJson);
            this.carts = carts;
        } catch (error) {
            console.error(error);
        }
    }

    async saveCartsToFile() {
        try {
            const cartsJson = JSON.stringify(this.carts, null, 2);
            await fs.promises.writeFile('carts.json', cartsJson);
        } catch (error) {
            console.error(error);
        }
    }
}

export default CartManager