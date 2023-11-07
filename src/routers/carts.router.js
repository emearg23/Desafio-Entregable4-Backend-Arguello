import { Router } from 'express';
import { CartsManager } from '../managers/carts.manager.js';

const router = Router();
const cartsManager = new CartsManager('./data/carts.json');

router.post('/', async(req, res)=>{
    try {
        const newCart = await cartsManager.createCart(req.body);
        res.status(200).json(newCart);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

router.get('/:cid', async(req, res)=>{
    try {
        const {cid} = req.params;
        const cart = await cartsManager.getCartById(cid)
        if(!cart){
            res.status(404).json({message: `Carrito no encontrado con id ${cid}`});
        } else {
        res.status(200).json(cart)};
    } catch (error) {
        console.log('error catch:', error);
        res.status(500).json(error.message);
    }
});

router.post('/:cid/product/:pid', async(req, res)=>{
    try {
        const { cid, pid } =req.params;
        const updateCart = await cartsManager.saveProductToCart(Number(cid), Number(pid));
        res.status(200).json(updateCart);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

export default router;