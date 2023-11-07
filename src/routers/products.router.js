import { Router } from 'express';
import { ProductManager } from '../managers/products.manager.js';
import { productValidator } from '../middlewares/productsValidator.js';

const router = Router();
const productManager = new ProductManager('./data/products.json');

router.get('/', async(req, res)=>{
    try {
        const products = await productManager.getProducts();
        const {limit} = req.query;
        if(!limit || isNaN(limit) || parseInt(limit) <=0){
            res.status(200).json(products);
        } else {
            const filterProducts = products.slice(0, limit);
            res.status(200).json(filterProducts);
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
})

router.get('/:pid', async(req, res)=>{
    try {
        const products = await productManager.getProducts();
        const {pid} = req.params;
        const productFind = products.find (p=>p.id ===Number(pid));
        if(!productFind) res.status(404).json({message: `Producto no encontrado con id ${pid}`});
        else res.status(200).json(productFind);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

router.post('/', productValidator, async(req, res)=>{
    try {
        const newProduct = await productManager.addProduct(req.body);
        res.status(200).json(newProduct);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

router.put('/:pid', async(req, res)=>{
    try {
        const {pid} = req.params;
        const updateValues = req.body;
        const productUpdate = await productManager.updateProduct(Number(pid), updateValues);
        res.status(200).json(productUpdate);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

router.delete('/:pid', async(req, res)=>{
    try {
        const {pid} =req.params;
        const deletedProduct = await productManager.deleteProduct(Number(pid));
        res.status(200).json(deletedProduct)
    } catch (error) {
        res.status(500).json(error.message);
    }
});

export default router;