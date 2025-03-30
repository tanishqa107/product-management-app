import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import "./addproducts.css";

const AddProduct = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file input change
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Upload image to Supabase Storage and return the public URL
  const uploadImage = async (file) => {
    const fileName = `${Date.now()}-${file.name}`;
    // Include contentType from the file object
    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, { contentType: file.type });
    
    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }
    
    // Retrieve the public URL
    const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Retrieve the current user for RLS purposes
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("User session not found. Please log in again.");
      navigate("/login");
      setLoading(false);
      return;
    }

    let imageUrl = null;
    if (image) {
      imageUrl = await uploadImage(image);
    }

    // Insert the product with current user id
    const { error } = await supabase.from("products").insert([
      {
        name,
        price: parseFloat(price),
        rating: parseFloat(rating),
        image_url: imageUrl, // Ensure this matches your table column
        user_id: user.id,    // Ensure your table has a user_id column and an appropriate RLS policy
      },
    ]);

    if (error) {
      console.error("Error adding product:", error);
      alert("Error adding product. Check the console for details.");
    } else {
      alert("Product added successfully!");
      navigate("/dashboard");
    }
    setLoading(false);
  };

  // Simple navigation back to dashboard
  const goBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="container mt-5">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Price ($)</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Rating (1-5)</label>
          <input
            type="number"
            className="form-control"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="5"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Product Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
      <button className="btn btn-secondary mt-3" onClick={goBackToDashboard}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default AddProduct;

