import MainFrame from "./MainFrame"
import SubImages from "./SubImages"
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const ImageContainer = ({game_details,currentImage,handleMouseEnter,handleMouseLeave}) => {
    useEffect(() => {
      AOS.init({
        duration: 1000, // Animation duration in milliseconds
        offset: 50, // Offset from the element
        easing: "ease-in-out", // Easing style
      });
      AOS.refresh();
    }, []);
  return (
    <div className="image_container">
    <MainFrame main_image={currentImage}   data-aos="fade-up"/>
    <SubImages  
    sub_images={game_details.sub_images} 
    handleMouseEnter={handleMouseEnter}
    handleMouseLeave={handleMouseLeave} data-aos="fade-left" />
    </div>
  )
}

export default ImageContainer