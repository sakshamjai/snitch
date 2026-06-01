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