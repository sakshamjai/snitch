import axios from 'axios';

const productApiInstance = axios.create({
    baseURL: '/api/product',
    withCredentials: true
})

export async function createProduct(formData){
    const response =  await productApiInstance.post('/', formData);
    return response.data;
}

export async function getSellerProducts() {
    const response = await productApiInstance.get('/seller');
    console.log(response.data);
    return response.data;
}

export async function getProducts(){
    const response = await productApiInstance.get('/');
    return response.data;
}

export async function getProductById(productId){
    const response = await productApiInstance.get(`/detail/${productId}`);
    return response.data;
}

export async function addProductVariant(productId, newProductVariant){
    const formData = new FormData();
    newProductVariant.images.forEach((image) => {
        formData.append("images", image.file);
    })
    formData.append("stock", newProductVariant.stock);
    formData.append("priceAmount", newProductVariant.price);
    formData.append("attributes", JSON.stringify(newProductVariant.attributes));

    const response = await productApiInstance.post(`/variant/${productId}`, formData);
    return response.data;
}