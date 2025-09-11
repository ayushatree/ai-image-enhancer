import axios from "axios";

const API_KEY = "wx7g5yd9csbk0lyk4";
const BASE_URL = "https://techhk.aoscdn.com";
const MAXIMUM_RETRIES = 20;

export const enhancedImageAPI = async (file) => {
  try {
    // Convert to JPEG to ensure supported format
    const jpegFile = await convertToJpeg(file);

    const taskId = await uploadImage(jpegFile);
    console.log("✅ Task ID:", taskId);

    const result = await pollForEnhancedImage(taskId);
    console.log("✅ Enhanced Result:", result);

    // Return final image URL directly
    return result?.image_url || result?.image;
  } catch (error) {
    console.error("Enhance API error:", error.message);
    throw error;
  }
};

const convertToJpeg = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], "upload.jpg", { type: "image/jpeg" }));
            } else {
              reject(new Error("Image conversion failed"));
            }
          },
          "image/jpeg",
          0.95
        );
      };
      img.src = e.target.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image_file", file);

  const { data } = await axios.post(`${BASE_URL}/api/tasks/visual/scale`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "X-API-KEY": API_KEY,
    },
  });

  console.log("📤 UPLOAD RESPONSE:", data);

  if (!data?.data?.task_id) throw new Error("Task ID not found");
  return data.data.task_id;
};

const pollForEnhancedImage = async (taskId, retries = 0) => {
  const result = await fetchEnhancedImage(taskId);

  console.log(`🔄 Poll ${retries}:`, result);

  if (result.state === 4) {
    if (retries >= MAXIMUM_RETRIES) throw new Error("Max retries reached");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return pollForEnhancedImage(taskId, retries + 1);
  }

  if (result.state < 0) throw new Error(result.err_message || "Enhancement failed");

  return result;
};

const fetchEnhancedImage = async (taskId) => {
  const { data } = await axios.get(`${BASE_URL}/api/tasks/visual/scale/${taskId}`, {
    headers: { "X-API-KEY": API_KEY },
  });

  console.log("📥 FETCH RESPONSE:", data);

  if (!data?.data) throw new Error("Image not found");
  return data.data;
};
