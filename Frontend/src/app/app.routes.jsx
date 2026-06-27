import { createBrowserRouter } from 'react-router';
import Register from '../features/auth/pages/Register';
import Login from '../features/auth/pages/Login';
import CreateProduct from '../features/auth/pages/CreateProduct';
import SellerDashboard from '../features/auth/pages/SellerDashboard';
import Home from '../features/auth/pages/Home';
import Protected from '../features/auth/components/Protected';
import ProductDetail from '../features/auth/pages/ProductDetail';
import SellerProductDetail from '../features/auth/pages/SellerProductDetail';
import AppLayout from './AppLayout';
import Cart from '../features/cart/pages/Cart';

export const router = createBrowserRouter([
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/cart',
        element: <Cart />
    },
    {
        element: <AppLayout />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/product/:productId',
                element: <ProductDetail />
            },
            {
                path: '/seller',
                children: [
                    {
                        path: '/seller/create-product',
                        element: <Protected role  = "seller"> <CreateProduct /> </Protected>
                    },
                    {
                        path: "/seller/dashboard",
                        element: <Protected role = 'seller'> <SellerDashboard /> </Protected>
                    },
                    {
                        path: '/seller/product/:productId',
                        element: <Protected role = 'seller'> <SellerProductDetail /></Protected>
                    }
                ]
            }
        ]
    }
])