import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import { Link } from "react-router-dom";
import "./dashboard.css";


const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortOption, setSortOption] = useState("newest");
  const [loggingOut, setLoggingOut] = useState(false); 
  const productsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    if (loggingOut) return; // Don't check session during logout
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
      } else {
        setUser(user);
        fetchTotalProducts();
        fetchProducts(page, sortOption);
      }
    };

    checkUser();
  }, [navigate, page, sortOption, loggingOut]);

  
  const fetchTotalProducts = async () => {
    const { count } = await supabase.from("products").select("*", { count: "exact" });
    setTotalProducts(count || 0);
  };

 
  const fetchProducts = async (pageNumber, sortBy) => {
    const start = (pageNumber - 1) * productsPerPage;
    const end = start + productsPerPage - 1;

    let query = supabase.from("products").select("*").range(start, end);

    if (sortBy === "price-low-high") {
      query = query.order("price", { ascending: true });
    } else if (sortBy === "price-high-low") {
      query = query.order("price", { ascending: false });
    } else if (sortBy === "rating-high-low") {
      query = query.order("rating", { ascending: false });
    } else if (sortBy === "rating-low-high") {
      query = query.order("rating", { ascending: true });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data);
    }
  };


  const nextPage = () => {
    if (page < Math.ceil(totalProducts / productsPerPage)) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  
  const handleLogout = async () => {
    setLoggingOut(true);
    const { error } = await supabase.auth.signOut();
    console.log("Logout error:", error);
    if (error) {
      alert("Error during logout, please try again.");
      setLoggingOut(false);
    } else {
      // Force a full page reload to clear all state and session info
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Welcome to Dashboard</h2>
      {user && <p>Logged in as: {user.email}</p>}
      <button onClick={handleLogout} className="btn btn-danger mb-3">
        Logout
      </button>
      <Link to="/add-product" className="btn btn-success mb-3">
        Add New Product
      </Link>

      <h3>Product List</h3>

      
      <div className="mb-3">
        <label>Sort By:</label>
        <select
          className="form-select"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
          <option value="rating-high-low">Rating: High to Low</option>
          <option value="rating-low-high">Rating: Low to High</option>
        </select>
      </div>

      <ul className="list-group">
        {products.length > 0 ? (
          products.map((product) => (
            <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    width="50"
                    height="50"
                    className="me-3"
                  />
                )}
                <strong>{product.name}</strong> - ${product.price} | ⭐ {product.rating}
              </div>
            </li>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </ul>

      
      <div className="mt-3">
        <button onClick={prevPage} className="btn btn-primary me-2" disabled={page === 1}>
          Previous
        </button>
        <span> Page {page} </span>
        <button
          onClick={nextPage}
          className="btn btn-primary"
          disabled={page >= Math.ceil(totalProducts / productsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

