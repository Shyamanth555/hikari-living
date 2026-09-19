import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { StorefrontLayout } from '../components/layout/StorefrontLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { Spinner } from '../components/ui/Spinner';

import Home from '../pages/Home';
import Shop from '../pages/Shop';
import NewLaunches from '../pages/NewLaunches';
import CategoryPage from '../pages/CategoryPage';
import ProductDetail from '../pages/ProductDetail';
import SearchResults from '../pages/SearchResults';
import Cart from '../pages/Cart';
import Login from '../pages/Login';
import Register from '../pages/Register';
import TrackOrder from '../pages/TrackOrder';
import About from '../pages/About';
import Contact from '../pages/Contact';
import CustomSculpture from '../pages/CustomSculpture';
import CorporateGifting from '../pages/CorporateGifting';
import Reviews from '../pages/Reviews';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsOfService from '../pages/TermsOfService';
import ShippingPolicy from '../pages/ShippingPolicy';
import ReturnPolicy from '../pages/ReturnPolicy';
import NotFound from '../pages/NotFound';

// Blog pages pull in react-markdown, so they're lazy-loaded out of the main bundle.
const Blog = lazy(() => import('../pages/Blog'));
const BlogPost = lazy(() => import('../pages/BlogPost'));

// Checkout/account/admin are behind auth, so they're lazy-loaded out of the
// initial storefront bundle — most visitors never touch these routes.
const Checkout = lazy(() => import('../pages/Checkout'));
const OrderConfirmation = lazy(() => import('../pages/OrderConfirmation'));

const AccountLayout = lazy(() => import('../pages/account/AccountLayout'));
const Profile = lazy(() => import('../pages/account/Profile'));
const OrderHistory = lazy(() => import('../pages/account/OrderHistory'));
const OrderDetail = lazy(() => import('../pages/account/OrderDetail'));

const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const ProductList = lazy(() => import('../pages/admin/products/ProductList'));
const ProductCreate = lazy(() => import('../pages/admin/products/ProductCreate'));
const ProductEdit = lazy(() => import('../pages/admin/products/ProductEdit'));
const CategoryList = lazy(() => import('../pages/admin/categories/CategoryList'));
const CategoryCreate = lazy(() => import('../pages/admin/categories/CategoryCreate'));
const CategoryEdit = lazy(() => import('../pages/admin/categories/CategoryEdit'));
const AdminOrderList = lazy(() => import('../pages/admin/orders/OrderList'));
const AdminOrderDetail = lazy(() => import('../pages/admin/orders/OrderDetail'));
const CustomerList = lazy(() => import('../pages/admin/customers/CustomerList'));
const CustomerDetail = lazy(() => import('../pages/admin/customers/CustomerDetail'));
const ContactMessages = lazy(() => import('../pages/admin/ContactMessages'));
const BlogPostList = lazy(() => import('../pages/admin/blog/BlogPostList'));
const BlogPostCreate = lazy(() => import('../pages/admin/blog/BlogPostCreate'));
const BlogPostEdit = lazy(() => import('../pages/admin/blog/BlogPostEdit'));
const HeroSlideList = lazy(() => import('../pages/admin/heroSlides/HeroSlideList'));
const HeroSlideCreate = lazy(() => import('../pages/admin/heroSlides/HeroSlideCreate'));
const HeroSlideEdit = lazy(() => import('../pages/admin/heroSlides/HeroSlideEdit'));

function PageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner size={28} />
    </div>
  );
}

export function AppRouter() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<StorefrontLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="new-launches" element={<NewLaunches />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="product/:slug" element={<ProductDetail />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="cart" element={<Cart />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="track-order" element={<TrackOrder />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="custom-sculpture" element={<CustomSculpture />} />
          <Route path="corporate-gifting" element={<CorporateGifting />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="policies/privacy" element={<PrivacyPolicy />} />
          <Route path="policies/terms" element={<TermsOfService />} />
          <Route path="policies/shipping" element={<ShippingPolicy />} />
          <Route path="policies/returns" element={<ReturnPolicy />} />

          <Route element={<ProtectedRoute />}>
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-confirmation/:orderNumber" element={<OrderConfirmation />} />
            <Route path="account" element={<AccountLayout />}>
              <Route index element={<Profile />} />
              <Route path="orders" element={<OrderHistory />} />
              <Route path="orders/:orderNumber" element={<OrderDetail />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductCreate />} />
            <Route path="products/:id/edit" element={<ProductEdit />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="categories/new" element={<CategoryCreate />} />
            <Route path="categories/:id/edit" element={<CategoryEdit />} />
            <Route path="orders" element={<AdminOrderList />} />
            <Route path="orders/:id" element={<AdminOrderDetail />} />
            <Route path="customers" element={<CustomerList />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
            <Route path="messages" element={<ContactMessages />} />
            <Route path="blog" element={<BlogPostList />} />
            <Route path="blog/new" element={<BlogPostCreate />} />
            <Route path="blog/:id/edit" element={<BlogPostEdit />} />
            <Route path="hero-slides" element={<HeroSlideList />} />
            <Route path="hero-slides/new" element={<HeroSlideCreate />} />
            <Route path="hero-slides/:id/edit" element={<HeroSlideEdit />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
