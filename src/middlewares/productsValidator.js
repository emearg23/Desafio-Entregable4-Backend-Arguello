export const productValidator = (req, res, next) =>{
    const {title, description, code, price, stock, category, thumbnail} = req.body;
    if(
        typeof title !== 'string'||
        typeof description !== 'string'||
        typeof code !== 'string'||
        typeof price !== 'number'||
        typeof stock !== 'number'||
        typeof category !== 'string'||
        (thumbnail !== undefined && (!Array.isArray(thumbnail) || thumbnail.some(item => typeof item !== 'string')))
    ){
        res.status(400).json({msg: 'Falta una propiedad o hay un error de tipo de variable'});
    } else {
        next()
    };
};