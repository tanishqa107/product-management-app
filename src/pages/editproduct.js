import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../supabaseClient";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
        alert("Error fetching product!");
      } else {
        setName(data.name);
        setPrice(data.price);
        setRating(data.rating);
      }
    };

    fetchProduct();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name || !price || !rating) {
      alert("All fields are required!");
      return;
    }

    const { error } = await supabase
      .from("products")
      .update({ name, price: parseFloat(price), rating: parseFloat(rating) })
      .eq("id", id);

    if (error) {
      console.error("Error updating product:", error);
      alert("Error updating product. Try again!");
    } else {
      alert("Product updated successfully!");
      navigate("/dashboard");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Edit Product</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Price ($)</label>
          <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Rating (1-5)</label>
          <input type="number" className="form-control" value={rating} onChange={(e) => setRating(e.target.value)} min="1" max="5" required />
        </div>
        <button type="submit" className="btn btn-primary">Update Product</button>
      </form>
      <button className="btn btn-secondary mt-3" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
    </div>
  );
};

export default EditProduct;
