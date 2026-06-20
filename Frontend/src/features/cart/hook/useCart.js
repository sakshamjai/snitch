import  { addItem } from '../service/cart.api.js';
import { useDispatch } from 'react-redux';
import { addItem as addItemToCart } from '../state/cart.slice.js'

export const useCart = () => {
    const dispatch = useDispatch();

    const handleAddItem = async ({productId, variantId}) => {
        const data = await addItem({productId, variantId});
        return data;
    }
    return { handleAddItem };
}