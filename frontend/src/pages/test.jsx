import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Sample data for categories with image paths
const categoriesData = [
  { name: "action", image: "/images/action.jpg" },
  { name: "adventure", image: "/images/adventure.jpg" },
  { name: "anime", image: "/images/anime.jpg" },
  { name: "brain storming", image: "/images/brain-storming.jpg" },
  { name: "building", image: "/images/building.jpg" },
  { name: "casual", image: "/images/casual.jpg" },
  { name: "co-op", image: "/images/co-op.jpg" },
  { name: "horror", image: "/images/horror.jpg" },
  { name: "mystery", image: "/images/mystery.jpg" },
  { name: "open world", image: "/images/open-world.jpg" },
  { name: "rpg", image: "/images/rpg.jpg" },
  { name: "sci-fi", image: "/images/sci-fi.jpg" },
  { name: "space", image: "/images/space.jpg" },
  { name: "sports", image: "/images/sports.jpg" },
  { name: "strategy", image: "/images/strategy.jpg" },
  { name: "survival", image: "/images/survival.jpg" }
];

const itemsPerPage = 4; // Number of images to display per page

const CategoryCarousel = () => {
  const [categoryIndex, setCategoryIndex] = useState(0);

  // Function to handle the index when navigating through the categories
  const handlecIndex = (direction) => {
    if (direction === 'next') {
      if (categoryIndex + itemsPerPage < categoriesData.length) {
        setCategoryIndex(categoryIndex + itemsPerPage);
      } else {
        setCategoryIndex(0); // Loop back to the start if reaching the end
      }
    } else if (direction === 'prev') {
      if (categoryIndex - itemsPerPage >= 0) {
        setCategoryIndex(categoryIndex - itemsPerPage);
      } else {
        setCategoryIndex(categoriesData.length - itemsPerPage); // Loop back to the end if reaching the start
      }
    }
  };

  return (
    <div className="carousel-container">
      {/* Left Arrow */}
      <div className="arrow-box">
        <IconButton
          className="arrow-cont-btn left-arrow"
          onClick={() => handlecIndex('prev')}
        >
          <ArrowBackIosIcon color="primary" className="arrowssub" />
        </IconButton>
      </div>

      {/* Display images based on categoryIndex */}
      <div className="categories-images">
        {categoriesData
          .slice(categoryIndex, categoryIndex + itemsPerPage)
          .map((category) => (
            <div key={category.name} className="discounts-img-box">
              <img src={category.image} alt={category.name} className="category-img" />
              <p>{category.name}</p>
            </div>
          ))}
      </div>

      {/* Right Arrow */}
      <div className="arrow-box">
        <IconButton
          className="arrow-cont-btn right-arrow"
          onClick={() => handlecIndex('next')}
        >
          <ArrowForwardIosIcon color="primary" className="arrowssub" />
        </IconButton>
      </div>
    </div>
  );
};

export default CategoryCarousel;
