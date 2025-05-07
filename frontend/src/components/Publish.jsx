
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Publish.css";

const Publish = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    gameName: "",
    description: "",
    poster: "",
    mainImage: "",
    subImages: ["", "", "", ""],
    gifs: ["", "", ""],
    category: "",
    releaseDate: "",
    gamePrice: "",
    about: ["", "", ""],
  });

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("subImage")) {
      const index = parseInt(name.split("-")[1]);
      const updatedSubImages = [...formData.subImages];
      updatedSubImages[index] = value;
      setFormData({ ...formData, subImages: updatedSubImages });
    } else if (name.startsWith("gif")) {
      const index = parseInt(name.split("-")[1]);
      const updatedGifs = [...formData.gifs];
      updatedGifs[index] = value;
      setFormData({ ...formData, gifs: updatedGifs });
    } else if (name.startsWith("about")) {
      const index = parseInt(name.split("-")[1]);
      const updatedAbout = [...formData.about];
      updatedAbout[index] = value;
      setFormData({ ...formData, about: updatedAbout });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle file uploads with better error handling
  const handleFileUpload = async (event, fieldName, index = null) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, WEBP)", { autoClose: 3000 });
      return;
    }

    // Show loading toast
    const loadingToastId = toast.loading("Uploading image...");

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "p2p_games");
    data.append("cloud_name", "dqj4jxhba");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dqj4jxhba/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const fileData = await response.json();
      const imageUrl = fileData.secure_url;

      // Update the appropriate field in state
      if (fieldName.startsWith("subImage")) {
        const updated = [...formData.subImages];
        updated[index] = imageUrl;
        setFormData({ ...formData, subImages: updated });
      } else if (fieldName.startsWith("gif")) {
        const updated = [...formData.gifs];
        updated[index] = imageUrl;
        setFormData({ ...formData, gifs: updated });
      } else if (fieldName.startsWith("about")) {
        const updated = [...formData.about];
        updated[index] = imageUrl;
        setFormData({ ...formData, about: updated });
      } else {
        setFormData({ ...formData, [fieldName]: imageUrl });
      }

      toast.update(loadingToastId, {
        render: "Upload successful!",
        type: "success",
        isLoading: false,
        autoClose: 2000
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast.update(loadingToastId, {
        render: `Upload failed: ${error.message}`,
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  // Validate form data before submission
  const validateForm = () => {
    // Check if any required fields are empty
    if (!formData.gameName.trim()) return "Game name is required";
    if (!formData.description.trim()) return "Description is required";
    if (!formData.poster) return "Poster image is required";
    if (!formData.mainImage) return "Main image is required";
    if (!formData.category) return "Category is required";
    if (!formData.releaseDate) return "Release date is required";
    if (!formData.gamePrice) return "Price is required";
    
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(formData.releaseDate)) {
      return "Release date must be in YYYY-MM-DD format";
    }
    
    // Check if all subImages are provided
    if (formData.subImages.some(img => !img)) {
      return "All sub images are required";
    }
    
    // Check if all GIFs are provided
    if (formData.gifs.some(gif => !gif)) {
      return "All GIF images are required";
    }
    
    // Check if all about items are provided
    if (formData.about.some(item => !item.trim())) {
      return "All about fields are required";
    }
    
    return null; // No validation errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError, {
        position: "top-center",
        autoClose: 3000
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/sell/games`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-username": localStorage.getItem("username"), // Include username in headers
        },
        body: JSON.stringify({
          gameName: formData.gameName,
          description: formData.description,
          poster: formData.poster,
          mainImage: formData.mainImage,
          subImages: formData.subImages,
          gifs: formData.gifs,
          category: formData.category,
          releaseDate: formData.releaseDate,
          gamePrice: formData.gamePrice,
          about: formData.about,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success(data.message || "Game uploaded successfully!", {
          position: "top-center",
          autoClose: 3000,
        });

        // Reset form after successful submission
        setFormData({
          gameName: "",
          description: "",
          poster: "",
          mainImage: "",
          subImages: ["", "", "", ""],
          gifs: ["", "", ""],
          category: "",
          releaseDate: "",
          gamePrice: "",
          about: ["", "", ""],
        });
      } else {
        throw new Error(data.message || "Error uploading the game");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || "Error uploading the game!", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Custom file input component
  const FileInput = ({ fieldName, value, index = null, label }) => (
    <div className="file-input-container">
      <div className="file-input-preview">
        {value && <img src={value} alt="Preview" className="upload-preview" />}
      </div>
      <div className="file-input-controls">
        <input
          type="text"
          name={index !== null ? `${fieldName}-${index}` : fieldName}
          value={value}
          onChange={handleChange}
          placeholder={`Enter ${label} link`}
        />
        <label className="file-upload-button">
          Upload
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, fieldName, index)}
            className="hidden-file-input"
          />
        </label>
      </div>
    </div>
  );

  return (
    <div className="seller-form-container">
      <ToastContainer position="top-center" />
      <h4>Sell Your Game</h4>
      <form onSubmit={handleSubmit} className="seller-form">
        <div className="sellgamediv">
          <h2>Game Description</h2>

          <div className="seller-input-group">
            <label>Game Name:</label>
            <input
              type="text"
              name="gameName"
              value={formData.gameName}
              onChange={handleChange}
              required
              placeholder="Enter game name"
            />
          </div>

          <div className="seller-input-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
              placeholder="Enter game description"
            />
          </div>
        </div>

        <div className="sellgamediv">
          <h2>Game Image Links:</h2>

          <div className="seller-input-group">
            <label>Poster:</label>
            <FileInput 
              fieldName="poster" 
              value={formData.poster} 
              label="poster image"
            />
          </div>

          <div className="seller-input-group">
            <label>Main Image:</label>
            <FileInput 
              fieldName="mainImage" 
              value={formData.mainImage} 
              label="main image"
            />
          </div>

          <div className="seller-input-group">
            <label>Sub Images:</label>
            {formData.subImages.map((subImage, index) => (
              <FileInput
                key={index}
                fieldName="subImage"
                index={index}
                value={subImage}
                label={`sub image ${index + 1}`}
              />
            ))}
          </div>

          <div className="seller-input-group">
            <label>GIFs:</label>
            {formData.gifs.map((gif, index) => (
              <FileInput
                key={index}
                fieldName="gif"
                index={index}
                value={gif}
                label={`GIF ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="sellgamediv">
          <h2>Other Info</h2>

          <div className="seller-input-group">
            <label>Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="ACTION">Action</option>
              <option value="ADVENTURE">Adventure</option>
              <option value="ANIME">Anime</option>
              <option value="BRAIN STORMING">Brain Storming</option>
              <option value="BUILDING">Building</option>
              <option value="CASUAL">Casual</option>
              <option value="CO-OP">Co-op</option>
              <option value="HORROR">Horror</option>
              <option value="MYSTERY">Mystery</option>
              <option value="OPEN WORLD">Open World</option>
              <option value="RPG">RPG</option>
              <option value="SCI-FI">Sci-Fi</option>
              <option value="SPACE">Space</option>
              <option value="SPORTS">Sports</option>
              <option value="STRATEGY">Strategy</option>
              <option value="SURVIVAL">Survival</option>
            </select>
          </div>

          <div className="seller-input-group">
            <label>Release Date:</label>
            <input
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
              required
              placeholder="Enter release date (YYYY-MM-DD)"
            />
          </div>

          <div className="seller-input-group">
            <label>Price ($):</label>
            <input
              type="number"
              name="gamePrice"
              value={formData.gamePrice}
              onChange={handleChange}
              required
              placeholder="Enter game price"
              min="0"
              step="0.01"
            />
          </div>

          <div className="seller-input-group">
            <label>About:</label>
            {formData.about.map((aboutItem, index) => (
              <input
                key={index}
                type="text"
                name={`about-${index}`}
                value={aboutItem}
                onChange={handleChange}
                required
                placeholder={`Enter about detail ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className={isSubmitting ? "submitting" : ""}
        >
          {isSubmitting ? "Uploading..." : "Upload Game"}
        </button>
      </form>
    </div>
  );
};

export default Publish;
