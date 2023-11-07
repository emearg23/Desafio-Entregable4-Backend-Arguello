import fs from "fs";

async function loadProducts() {
  try {
    const productsData = await fs.promises.readFile(
      "./data/products.json",
      "utf-8"
    );
    const productsJSON = JSON.parse(productsData);
    return productsJSON;
  } catch (error) {
    throw new Error(`Error al cargar los productos: ${error.message}`);
  }
}
export class CartsManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
  }
  async getCarts() {
    try {
      if (fs.existsSync(this.path)) {
        const cartJSON = await fs.promises.readFile(this.path, "utf-8");
        const cartJavaScript = JSON.parse(cartJSON);
        return cartJavaScript;
      } else return [];
    } catch (error) {
      throw new Error(`Error al leer el archivo: ${error.message}`);
    }
  }
  async getCartById(idSearch) {
    try {
      const cart = await this.#findCartById(idSearch);
      if (!cart) {
        return null;
      }
      return cart;
    } catch (error) {
      throw new Error(`Error al buscar el carrito con ${idSearch} ingresado`);
    }
  }

  async saveProductToCart(idCart, idProd) {
    try {
      const products = await loadProducts();
      const cartExists = await this.#findCartById(idCart);
      if (cartExists) {
        const productToAdd = products.find((product) => product.id === idProd);
        if (productToAdd) {
          const existingProductInCart = cartExists.products.find(
            (p) => p.id === idProd
          );
          if (existingProductInCart) {
            existingProductInCart.quantity += 1;
          } else {
            const newCartItem = {
              id: idProd,
              quantity: 1,
            };
            cartExists.products.push(newCartItem);
          }
        } else {
          throw new Error(`Producto con id ${idProd} no encontrado`);
        }
      } else {
        throw new Error(`Carrito con id ${idCart} no encontrado`);
      }
      await this.#saveCart(cartExists);
      return cartExists;
    } catch (error) {
      throw new Error(
        `Error al guardar el producto en el carrito: ${error.message}`
      );
    }
  }

  async createCart() {
    try {
      const carts = await this.getCarts();
      const cart = {
        id: this.#generateId(carts),
        products: [],
      };
      carts.push(cart);
      await fs.promises.writeFile(this.path, JSON.stringify(carts));
      return cart;
    } catch (error) {
      throw new Error(`Error al crear el carrito: ${error.message}`);
    }
  }

  #generateId(carts) {
    if (!carts || carts.length === 0) {
      return 1;
    }
    const maxId = carts.reduce(
      (max, cartItem) => (cartItem.id > max ? cartItem.id : max),
      0,
      carts[0].id
    );
    return maxId + 1;
  }
  async #findCartById(idSearch) {
    const cart = await this.getCarts();
    return cart.find((cart) => cart.id === Number(idSearch));
  }
  async #saveCart(cart) {
    let carts = await this.getCarts();
    const indexToUpdate = carts.findIndex((cart) => cart.id === cart.id);
    carts[indexToUpdate] = cart;
    await fs.promises.writeFile(this.path, JSON.stringify(carts));
  }
}
