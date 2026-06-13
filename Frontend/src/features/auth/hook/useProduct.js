import { useDispatch } from 'react-redux'
import { createProduct, getSellerProducts, getProducts, getProductById, addProductVariant } from '../service/product.api';
import { setProducts, setSellerProducts } from '../state/product.slice';

export const useProduct = () => {
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

    async function handleGetAllProducts(){
        const response = await getProducts();
        console.log(response.products);
        dispatch(setProducts(response.products));
        return response.products;
    }

    async function handleGetProductById(productId){
        const response = await getProductById(productId);
        return response?.product;
    }

    async function handleAddProductVariant(productId, newProductVariant){
        const data = await addProductVariant(productId, newProductVariant);
        return data.product;
    }

    return {handleCreateProduct, handleGetSellerProducts, handleGetAllProducts, handleGetProductById, handleAddProductVariant};
}