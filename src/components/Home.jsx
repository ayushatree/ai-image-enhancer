import ImageUpload from "./ImageUpload";
import ImagePreview from "./ImagePreview";
import { useState } from "react";
import { enhancedImageAPI } from "../utils/enhaceImageApi";

const Home = () => {
  const [uploadImage, setUploadImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const UploadImageHandler = async (file) => {
    setUploadImage(URL.createObjectURL(file));
    setEnhancedImage(null);
    setLoading(true);

    try {
      const imageUrl = await enhancedImageAPI(file);
      console.log("Enhanced image URL:", imageUrl);
      setEnhancedImage(imageUrl);
    } catch (error) {
      console.error("Enhance error:", error);
      alert("Error while enhancing the image. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ImageUpload UploadImageHandler={UploadImageHandler} />
      <ImagePreview
        loading={loading}
        uploaded={uploadImage}
        enhanced={enhancedImage}
      />
    </>
  );
};

export default Home;
