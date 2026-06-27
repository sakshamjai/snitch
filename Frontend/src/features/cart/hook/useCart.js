import  { addItem, getCart } from '../service/cart.api.js';
import { useDispatch } from 'react-redux';
import { addItem as addItemToCart, setItems } from '../state/cart.slice.js'

export const useCart = () => {
    const dispatch = useDispatch();

    const handleAddItem = async ({productId, variantId}) => {
        const data = await addItem({productId, variantId});
        return data;
    }
    const handleGetCart = async () => {
        const data = await getCart();
        dispatch(setItems(data.cart.items));
    }

    return { handleAddItem, handleGetCart };
}
