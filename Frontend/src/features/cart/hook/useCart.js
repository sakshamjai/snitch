import  { addItem, getCart, incrementCartItemApi } from '../service/cart.api.js';
import { useDispatch } from 'react-redux';
import { addItem as addItemToCart, setCart, incrementCartItem } from '../state/cart.slice.js'

export const useCart = () => {
    const dispatch = useDispatch();

    const handleAddItem = async ({productId, variantId}) => {
        const data = await addItem({productId, variantId});
        return data;
    }
    const handleGetCart = async () => {
        const data = await getCart();
        console.log(data);
        dispatch(setCart(data.cart));
    }

    const handleIncrementCartItem = async ({productId, variantId}) => {
        const data = await incrementCartItemApi({productId, variantId});
        dispatch(incrementCartItem({productId, variantId}));
    }

    return { handleAddItem, handleGetCart, handleIncrementCartItem };
}
