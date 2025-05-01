// export default HomePage;
import React, { useState, useEffect } from "react";
import styles from "../styles/Homepage.module.css";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchHomeGames } from "../redux/slices/homeGamesSlice";
import Header from "./Header";
import Footer from "./Footer";
import AOS from "aos";

import { motion } from "framer-motion";
// const redis_client = require(".../backend/redis_client.js");

const raw = localStorage.getItem("cart-storage");
const parsed = JSON.parse(raw);
console.log(parsed?.state?.cart);

import "aos/dist/aos.css";
const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

const thumbnailVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: index * 0.1,
    },
  }),
};
const HomePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [category, setCategory] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      offset: 50,
      easing: "ease-in-out",
    });
    AOS.refresh();
  }, []);

  // Access games data and status from Redux
  const {
    featuredGames,
    discountsGames,
    newGames,
    popularGames,
    highlightGames,
    status,
    error,
  } = useSelector((state) => state.homeGames);

  console.log("FROM redux " + featuredGames);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchHomeGames());
    }
  }, [status, dispatch]);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? featuredGames.length - 1 : prevIndex - 1
    );
  };
  const [currentMain, setCurrentMain] = useState(0);
  const handleMain = (index) => {
    setCurrentMain(index);
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === featuredGames.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === featuredGames.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);
    return () => clearInterval(intervalId);
  }, [featuredGames.length]);

  const [search, setSearch] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    if (search.trim()) {
      navigate(`/game/?term=${search}`);
    }
    setSearch("");
  };

  // const [showCategories, setShowCategories] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setShowCategories(true);
    if (!hovered) {
      handleMouseHovered();
    }
  };

  const handleMouseHovered = () => {
    setHovered(true);
    setShowCategories(true);
  };

  const handleMouseLeave = () => {
    setShowCategories(false);
    setHovered(false);
  };

  const [popularIndex, setPopularIndex] = useState(0);
  const [newIndex, setNewIndex] = useState(0);
  const itemsPerPage = 4;

  const handlepIndex = () => {
    if (popularIndex + itemsPerPage < popularGames.length) {
      setPopularIndex(popularIndex + itemsPerPage);
    } else {
      setPopularIndex(0);
    }
  };

  const handlenIndex = () => {
    if (newIndex + itemsPerPage < newGames.length) {
      setNewIndex(newIndex + itemsPerPage);
    } else {
      setNewIndex(0);
    }
  };

  const [highlightIndex, setHighlightIndex] = useState(0);

  const handleHighlight = () => {
    setHighlightIndex((prevIndex) => (prevIndex + 1) % highlightGames.length);
  };

  useEffect(() => {
    const interval = setTimeout(handleHighlight, 6000);
    return () => clearTimeout(interval);
  }, [highlightIndex, highlightGames.length]);

  const fetchGamePage = (game_name) => {
    navigate(`/game/${game_name}`);
  };

  const handleCategoryClick = (event) => {
    const selectedCategory = event.target.innerText.trim();
    setCategory(selectedCategory);

    // Navigate only if category is valid
    if (selectedCategory) {
      navigate(`/game/?term=${encodeURIComponent(selectedCategory)}`);
    }

    // Clear the category state
    setCategory("");
  };

  const handleCategoryblock = (selectedCategory) => {
    if (selectedCategory) {
      navigate(`/game/?term=${encodeURIComponent(selectedCategory)}`);
    }
  };

  const categoriesData = [
    { name: "ACTION", image: "/images/action.jpg" },
    { name: "ADVENTURE", image: "/images/adventure.jpg" },
    { name: "ANIME", image: "/images/anime.jpg" },
    { name: "BRAIN STORMING", image: "/images/brain-storming.jpg" },
    { name: "BUILDING", image: "/images/building.jpg" },
    { name: "CASUAL", image: "/images/casual.jpg" },
    { name: "CO-OP", image: "/images/co-op.jpg" },
    { name: "HORROR", image: "/images/horror.jpg" },
    { name: "MYSTERY", image: "/images/mystery.jpg" },
    { name: "OPEN WORLD", image: "/images/open-world.jpg" },
    { name: "RPG", image: "/images/rpg.jpg" },
    { name: "SCI-FI", image: "/images/sci-fi.jpg" },
    { name: "SPACE", image: "/images/space.jpg" },
    { name: "SPORTS", image: "/images/sports.jpg" },
    { name: "STRATEGY", image: "/images/strategy.jpg" },
    { name: "SURVIVAL", image: "/images/survival.jpg" },
  ];

  const [categoryIndex, setCategoryIndex] = useState(0);

  const handlecIndex = (direction) => {
    if (direction === "next") {
      if (categoryIndex + itemsPerPage < categoriesData.length) {
        setCategoryIndex(categoryIndex + itemsPerPage);
      } else {
        setCategoryIndex(0);
      }
    } else if (direction === "prev") {
      if (categoryIndex - itemsPerPage >= 0) {
        setCategoryIndex(categoryIndex - itemsPerPage);
      } else {
        setCategoryIndex(categoriesData.length - itemsPerPage);
      }
    }
  };

  return (
    <div className={styles["container"]}>
      <Header />
      <div
        className={styles["nav-components"]}
        // onMouseEnter={handleMouseEnter}
        // onMouseLeave={handleMouseLeave}
      >
        <li>
          <Link to="/">YOUR STORE</Link>
        </li>
        <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Link to=""> CATEGORIES</Link>
        </li>
        <li>
          <Link to="/about">ABOUT</Link>
        </li>
        <li>
          <Link to="/cart">CART</Link>
        </li>
      </div>

      <div
        className={styles["categoryBox"]}
        onMouseEnter={handleMouseHovered}
        onMouseLeave={handleMouseLeave}
      >
        {showCategories && (
          <div
            className={styles["category"]}
            onMouseOver={(e) => e.stopPropagation()}
            onMouseOut={(e) => e.stopPropagation()}
          >
            <ul>
              <li onClick={handleCategoryClick}>ACTION</li>
              <li onClick={handleCategoryClick}>HORROR</li>
              <li onClick={handleCategoryClick}>SPORTS</li>
              <li onClick={handleCategoryClick}>ANIME</li>
            </ul>
            <ul>
              <li onClick={handleCategoryClick}>OPEN WORLD</li>
              <li onClick={handleCategoryClick}>STRATEGY</li>
              <li onClick={handleCategoryClick}>ADVENTURE</li>
              <li onClick={handleCategoryClick}>SCI-FI</li>
            </ul>
            <ul>
              <li onClick={handleCategoryClick}>CASUAL</li>
              <li onClick={handleCategoryClick}>SURVIVAL</li>
              <li onClick={handleCategoryClick}>BUILDING</li>
              <li onClick={handleCategoryClick}>RPG</li>
            </ul>
            <ul>
              <li onClick={handleCategoryClick}>MYSTERY & DETECTIVE</li>
              <li onClick={handleCategoryClick}>SPACE</li>
              <li onClick={handleCategoryClick}>CO-OP GAMES</li>
              <li onClick={handleCategoryClick}>BRAIN STORMING</li>
            </ul>
          </div>
        )}
      </div>

      <h1 className={styles["featured-heading"]} data-aos="fade-up">
        FEATURED GAMES
      </h1>
      <div className={styles["featured-section"]} data-aos="fade-up">
        <IconButton
          className={styles["arrow-btn left-arrow"]}
          onClick={handlePrevClick}
          data-aos="fade-left"
        >
          <ArrowBackIosIcon color="primary" className={styles["arrows"]} />
        </IconButton>
        <div className={styles["featured-main"]}>
          <div className={styles["main-image-container"]}>
            {featuredGames.length > 0 && (
              <div
                onClick={() =>
                  fetchGamePage(featuredGames[currentIndex].game_name)
                }
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={currentMain} // Ensure re-render when switching images
                  transition={{ duration: 0.5 }}
                >
                  <motion.img
                    src={
                      currentMain === 0
                        ? featuredGames[currentIndex].main_image
                        : featuredGames[currentIndex].sub_images[
                            currentMain - 1
                          ]
                    }
                    alt={featuredGames[currentIndex].game_name}
                    className={styles["main-image"]}
                    layoutId={`image-${currentMain}-${currentIndex}`}
                  />
                </motion.div>
                {currentMain !== 0 && (
                  <motion.p
                    className={styles["game-name"]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {featuredGames[currentIndex].game_name}
                  </motion.p>
                )}
              </div>
            )}
          </div>
        </div>

        <div
          className={styles["subImg"]}
          onClick={() => fetchGamePage(featuredGames[currentIndex].game_name)}
        >
          {featuredGames.length > 0 &&
            featuredGames[currentIndex].sub_images.map((image, index) => (
              <motion.img
                custom={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                key={index}
                src={image}
                alt={`Recommended ${index + 1}`}
                onMouseOver={() => handleMain(index + 1)}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                layoutId={`sub-image-${index}-${currentIndex}`}
              />
            ))}
        </div>

        <IconButton
          className={styles["arrow-btn right-arrow"]}
          onClick={handleNextClick}
        >
          <ArrowForwardIosIcon
            color="primary"
            className={styles["arrows"]}
            data-aos="fade-right"
          />
        </IconButton>
      </div>

      {/* 
      <div className={styles["featured-section"]} data-aos="fade-up">
        <IconButton
          className={styles["arrow-btn left-arrow"]}
          onClick={handlePrevClick}
          data-aos="fade-left"
        >
          <ArrowBackIosIcon color="primary" className={styles["arrows"]} />
        </IconButton>
        <>
          <>
            <div className={styles["featured-main"]}>
              <div className={styles["main-image-container"]}>
                {featuredGames.length > 0 && (
                  <div
                    onClick={() =>
                      fetchGamePage(featuredGames[currentIndex].game_name)
                    }
                  >
                    {currentMain === 0 ? (
                      <>
                        <img
                          src={featuredGames[currentIndex].main_image}
                          alt={featuredGames[currentIndex].game_name}
                          className={styles["main-image"]}
                        />
                      </>
                    ) : (
                      <>
                        <p className={styles["game-name"]}>
                          {featuredGames[currentIndex].game_name}
                        </p>

                        <img
                          src={
                            featuredGames[currentIndex].sub_images[
                              currentMain - 1
                            ]
                          }
                          alt={featuredGames[currentIndex].game_name}
                          className={styles["main-image"]}
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div
              className={styles["subImg"]}
              onClick={() =>
                fetchGamePage(featuredGames[currentIndex].game_name)
              }
            >
              {featuredGames.length > 0 && (
                <>
                  {featuredGames[currentIndex].sub_images.map(
                    (image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Recommended ${index + 1}`}
                        onMouseOver={() => handleMain(index + 1)}
                      />
                    )
                  )}
                </>
              )}
            </div>
          </>
        </>

        <IconButton
          className={styles["arrow-btn right-arrow"]}
          onClick={handleNextClick}
        >
          <ArrowForwardIosIcon
            color="primary"
            className={styles["arrows"]}
            data-aos="fade-right"
          />
        </IconButton>
      </div> */}

      <p className={styles["popular-section-heading"]} data-eos="fade-up">
        Popular Games
      </p>
      <div className={styles["popular-section"]}>
        <div className={styles["arrow-pbox"]}>
          <IconButton
            className={styles["arrow-cont-btn left-arrow"]}
            onClick={() => handlepIndex()}
          >
            <ArrowBackIosIcon color="primary" className={styles["arrowssub"]} />
          </IconButton>
        </div>

        {popularGames.slice(popularIndex, popularIndex + 4).map((image) => (
          <div
            key={image._id}
            className={styles["discounts-img-box"]}
            data-aos="flip-up"
            data-aos-delay={popularIndex * 100}
          >
            <img
              src={image.poster}
              alt={image.game_name}
              onClick={() => fetchGamePage(image.game_name)}
            />
            <p>{image.game_name}</p>
          </div>
        ))}

        <div className={styles["arrow-pbox"]}>
          <IconButton
            className={styles["arrow-cont-btn right-arrow"]}
            onClick={() => handlepIndex()}
          >
            <ArrowForwardIosIcon
              color="primary"
              className={styles["arrowssub"]}
            />
          </IconButton>
        </div>
      </div>

      <p className={styles["featured-discounts-heading"]} data-aos="fade-up">
        Discounts Games
      </p>
      <div className={styles["featured-discounts"]} data-aos="fade-up">
        <div className={styles["arrow-box"]}>
          <IconButton
            className={styles["arrow-cont-btn left-arrow"]}
            onClick={() => handlenIndex()}
          >
            <ArrowBackIosIcon color="primary" className={styles["arrowssub"]} />
          </IconButton>
        </div>

        {discountsGames
          .slice(newIndex, newIndex + itemsPerPage)
          .map((image) => (
            <div
              key={image._id}
              className={styles["discounts-img-box"]}
              data-aos="flip-up"
            >
              <img
                src={image.poster}
                alt={image.game_name}
                onClick={() => fetchGamePage(image.game_name)}
              />
              <p>{image.game_name}</p>
            </div>
          ))}

        <div className={styles["arrow-box"]}>
          <IconButton
            className={styles["arrow-cont-btn right-arrow"]}
            onClick={() => handlenIndex()}
          >
            <ArrowForwardIosIcon
              color="primary"
              className={styles["arrowssub"]}
            />
          </IconButton>
        </div>
      </div>

      <div className={styles["search"]} data-aos="fade-up">
        <p>Uncover the gaming universe</p>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search Game"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <IconButton className={styles["search-icon"]} type="submit">
            <SearchIcon color="primary" className={styles["search-btn"]} />
          </IconButton>
        </form>
      </div>

      <div className={styles["sign-in"]} data-aos="fade-up">
        <p>Sign In To Explore Unlimited Game And Access More Features</p>
        <a href="http://localhost:5000/login">SIGN IN</a>
        <p>
          Or <a href="http://localhost:5000/register">Register</a> For Free Now
          To Explore
        </p>
      </div>

      <p className={styles["categories-heading"]} data-aos="fade-up">
        CATEGORIES
      </p>
      <div className={styles["categories-container"]} data-aos="flip-up">
        <div className={styles["arrow-box"]}>
          <IconButton
            className={styles["arrow-cont-btn left-arrow"]}
            onClick={() => handlecIndex("prev")}
          >
            <ArrowBackIosIcon color="primary" className={styles["arrowssub"]} />
          </IconButton>
        </div>

        {categoriesData
          .slice(categoryIndex, categoryIndex + itemsPerPage)
          .map((image, index) => (
            <div
              key={index} // Add a unique key for each mapped element
              className={styles["image-container"]}
              onClick={() => handleCategoryblock(image.name)}
            >
              <img
                src={image.image}
                alt={image.name}
                className={styles["category-img"]}
              />
              <div className={styles["overlay"]}>
                <p className={styles["category-name"]}>{image.name}</p>
              </div>
            </div>
          ))}

        <div className={styles["arrow-box"]}>
          <IconButton
            className={styles["arrow-cont-btn right-arrow"]}
            onClick={() => handlecIndex("next")}
          >
            <ArrowForwardIosIcon
              color="primary"
              className={styles["arrowssub"]}
            />
          </IconButton>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
