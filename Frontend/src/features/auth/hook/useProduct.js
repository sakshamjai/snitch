import { useDispatch } from 'react-redux'
import { createProduct, getSellerProducts } from '../service/product.api';
import { setSellerProducts } from '../state/product.slice';

export const userProduct = () => {
    const dispatch = useDispatch();

    async function handleCreateProduct(formData){
        const response = await createProduct(formData);
        return response.product;
    }

    async function handleGetSellerProducts() {
        const response = await getSellerProducts();
        dispatch(setSellerProducts(response.products));
        return response.products;
    }

    return {handleCreateProduct, handleGetSellerProducts};
}