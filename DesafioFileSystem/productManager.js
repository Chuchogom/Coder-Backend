import fs from 'fs'

class ProductManager {

  constructor(path) {
    this.path = path
    this.products = []
  }

  //Get all the products
  getProducts = async () => {
    await this.loadProductsFromFile()
    return this.products
  }

  //Search a product by id
  productId = async () => {
    await this.loadProductsFromFile()
    const count = this.products.length
    const nextId = (count > 0) ? this.products[count - 1].id + 1 : 1
    return nextId
  }

  //Add a new product
  addProduct = async (title, description, price, thumbnail, stock) => {
    await this.loadProductsFromFile()
    const id = Number(await this.productId())
    const code = `PRD-${id}`;
    const product = {
      id,
      title,
      description,
      price,
      thumbnail,
      code: `PRD-${id}`,
      stock: stock === undefined ? 50 : stock
    }

    // Check if all parameters are defined
    if (
      title === undefined ||
      description === undefined ||
      price === undefined ||
      thumbnail === undefined ||
      stock === undefined ||
      code === undefined
    ) {
      throw new Error('All arguments are required')
    }

    // Check if the code already exists
    const productWithSameCode = this.products.find((product) => product.code === code)
    if (productWithSameCode) {
      throw new Error('The code already exists')
    }

    // Check if the stock is negative
    if (stock < 0) {throw new Error('Stock cannot be negative')}

    // Check if any of the variables are empty
    if (title === '' || description === '' || price === '' || thumbnail === '') {
      throw new Error('All arguments must be non-empty')
    }
    //Add the producyt to the array
    this.products.push(product)
    //Save the products in the json file
    this.saveProductsToFile()
    return id
  }

  //Get all the product info with an id
  getProductById = async (productId) => {
    await this.loadProductsFromFile()
    const product = this.products.find(product => product.id == productId)
    if (product == undefined) {
      return "Product Not Found"
    }
    return {id : product.id, ...product}
  }

  // Modify a product
  updateProduct = async (productId, updatedProduct) => {
    await this.loadProductsFromFile()
    const index = this.products.findIndex((product) => product.id == productId);
    if (index === -1) {
      return "Product Not Found";
    }
    this.products[index] = { ...this.products[index], ...updatedProduct };
    await this.saveProductsToFile();
  }

  // Delete a product
  deleteProduct = async (productId) => {
    await this.loadProductsFromFile()
    const index = this.products.findIndex((product) => product.id === productId)
    if (index === -1) {
      return "Product Not Found"
    }

    this.products.splice(index, 1)
    await this.saveProductsToFile()
  }

  async loadProductsFromFile() {
    try {
      const productsJson = await fs.promises.readFile('products.json', 'utf-8');
      if (!productsJson) {
        return [];
      }
      const products = JSON.parse(productsJson);
      this.products = products
    } catch (error) {
      console.error(error);
    }
  }

  async saveProductsToFile() {
    try {
      const productsJson = JSON.stringify(this.products, null, 2);
      await fs.promises.writeFile('products.json', productsJson);
    } catch (error) {
      console.error(error);
    }
  }
}


//Testing Area
const testFunctions = async () => {
  const productManager = new ProductManager()
  await productManager.addProduct("Bycicle","Mountain Bycicle",299,"https://m.media-amazon.com/images/I/71qMz+mUekL._AC_SX679_.jpg",33)
  await productManager.getProducts()
  console.log(await productManager.getProductById(1))
  console.log(await productManager.getProductById(5))
}

testFunctions()

//productManager.addProduct("Bycicle City","City Bycicle",299,"No Image",33)


// const updatedProduct ={
//   title:'Product Test',
//   price: 99.99
// }
// productManager.updateProduct(1,updatedProduct);

// productManager.deleteProduct(2);