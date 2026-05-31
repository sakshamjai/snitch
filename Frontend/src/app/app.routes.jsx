import { createBrowserRouter } from 'react-router';
import Register from '../features/auth/pages/Register';
import Login from '../features/auth/pages/Login';
import CreateProduct from '../features/auth/pages/CreateProduct';
import SellerDashboard from '../features/auth/pages/SellerDashboard';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <div>Home Page</div>
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
                element: <CreateProduct />
            },
            {
                path: '/seller/allProducts',
                element: <SellerDashboard />
            }
        ]
    }
])