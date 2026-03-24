import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  DollarSign, Package, ShoppingBag, Heart,
  ShoppingCart, Star, User, TrendingUp,
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { productsApi, productQueryKeys } from '../api/products';
import { formatPrice, formatNumber } from '../utils/currency';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const { cart }      = useCart();
  const { wishlist }  = useWishlist();

  const { data: products = [], isLoading } = useQuery({
    queryKey: productQueryKeys.lists(),
    queryFn: productsApi.getAll,
  });

  const metrics = useMemo(() => {
    const totalOrders   = products.length > 0 ? 87 : 0; // deterministic mock
    const avgOrderValue = totalOrders > 0 ? cart.totalPrice / totalOrders : 0;

    const categoryMap = new Map<string, number>();
    products.forEach((p) => {
      categoryMap.set(p.category, (categoryMap.get(p.category) ?? 0) + 1);
    });

    const topCategories = Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalRevenue:   cart.totalPrice,
      totalOrders,
      avgOrderValue,
      totalProducts:  products.length,
      wishlistItems:  wishlist.length,
      topCategories,
    };
  }, [products, cart.totalPrice, wishlist.length]);

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="admin">
      <div className="admin__header">
        <h1 className="admin__title">Dashboard</h1>
        <p className="admin__subtitle">Store overview</p>
      </div>

      <div className="metrics-grid">
        <MetricCard
          icon={<DollarSign size={20} strokeWidth={1.5} aria-hidden />}
          label="Total Revenue"
          value={formatPrice(metrics.totalRevenue)}
          change="+12.5%"
          positive
        />
        <MetricCard
          icon={<Package size={20} strokeWidth={1.5} aria-hidden />}
          label="Total Orders"
          value={formatNumber(metrics.totalOrders)}
          change="+8.2%"
          positive
        />
        <MetricCard
          icon={<ShoppingBag size={20} strokeWidth={1.5} aria-hidden />}
          label="Products"
          value={formatNumber(metrics.totalProducts)}
          change="Active listings"
        />
        <MetricCard
          icon={<Heart size={20} strokeWidth={1.5} aria-hidden />}
          label="Wishlist Items"
          value={formatNumber(metrics.wishlistItems)}
          change="Saved by customers"
        />
      </div>

      <div className="stats-grid">
        <div className="stats-card">
          <h3 className="stats-card__title">Category Distribution</h3>
          <div className="category-list">
            {metrics.topCategories.map((cat) => (
              <div key={cat.category} className="category-item">
                <div className="category-item__header">
                  <span className="category-item__name">{cat.category}</span>
                  <span className="category-item__count">{cat.count} products</span>
                </div>
                <div className="category-bar">
                  <div
                    className="category-bar__fill"
                    style={{
                      width: `${(cat.count / (metrics.totalProducts || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="stats-card">
          <h3 className="stats-card__title">Recent Activity</h3>
          <div className="activity-list">
            {[
              { icon: <ShoppingCart size={16} strokeWidth={1.5} aria-hidden />, label: 'New order received', time: '2 min ago' },
              { icon: <Star size={16} strokeWidth={1.5} aria-hidden />,         label: 'New product review', time: '15 min ago' },
              { icon: <User size={16} strokeWidth={1.5} aria-hidden />,         label: 'New customer registration', time: '1 hr ago' },
              { icon: <Package size={16} strokeWidth={1.5} aria-hidden />,      label: 'Order shipped', time: '2 hr ago' },
            ].map((item, i) => (
              <div key={i} className="activity-item">
                <div className="activity-item__icon">{item.icon}</div>
                <div className="activity-item__info">
                  <p className="activity-item__label">{item.label}</p>
                  <span className="activity-item__time">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="products-table-container">
        <div className="products-table__header">
          <h3 className="stats-card__title">Top Products</h3>
          <span className="products-table__count">{products.length} total</span>
        </div>
        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>
                  <span className="th-rating">
                    <Star size={12} strokeWidth={1.5} aria-hidden /> Rating
                  </span>
                </th>
                <th>Reviews</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 10).map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="product-cell">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="product-cell__thumb"
                        loading="lazy"
                      />
                      <span className="product-cell__name">{product.title}</span>
                    </div>
                  </td>
                  <td><span className="category-badge">{product.category}</span></td>
                  <td className="price-cell">{formatPrice(product.price)}</td>
                  <td>
                    <div className="rating-cell">
                      <TrendingUp size={12} strokeWidth={1.5} aria-hidden />
                      {product.rating.rate.toFixed(1)}
                    </div>
                  </td>
                  <td>{formatNumber(product.rating.count)}</td>
                  <td><span className="status-badge">Active</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  positive?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, change, positive }) => (
  <div className="metric-card">
    <div className="metric-card__icon">{icon}</div>
    <div className="metric-card__info">
      <p className="metric-card__label">{label}</p>
      <h3 className="metric-card__value">{value}</h3>
      <span className={`metric-card__change ${positive ? 'metric-card__change--positive' : ''}`}>
        {change}
      </span>
    </div>
  </div>
);

export default AdminDashboard;
