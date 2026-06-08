import { createBrowserRouter } from 'react-router';
import Register from '../features/auth/pages/Register';
import Login from '../features/auth/pages/Login';
import CreateProduct from '../features/auth/pages/CreateProduct';
import SellerDashboard from '../features/auth/pages/SellerDashboard';
import Home from '../features/auth/pages/Home';
import Protected from '../features/auth/components/Protected';
import ProductDetail from '../features/auth/pages/ProductDetail';
import SellerProductDetail from '../features/auth/pages/SellerProductDetail';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/seller',
        children: [
            {
                path: '/seller/create-product',
                element: <Protected role = 'seller'>
                    <CreateProduct />
                </Protected>
            },
            {
                path: '/seller/dashboard',
                element: <Protected role = 'seller'>
                    <SellerDashboard />
                </Protected>
            },
            {
                path: '/seller/product/:productId',
                element: <Protected role = 'seller'>
                    <SellerProductDetail />
                </Protected>
            }
        ]
    },
    {
        path: '/product/:productId',
        element: <ProductDetail />
    }
])