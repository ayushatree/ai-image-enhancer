import Loading from "./Loading";

const ImagePreview = ({ uploaded, enhanced, loading }) => {
  const downloadImage = () => {
    if (!enhanced) return;
    const link = document.createElement("a");
    link.href = enhanced;
    link.download = "enhanced.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
      {/* Original Image */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <h2 className="text-xl font-semibold text-center bg-gray-800 text-white py-2">
          Original Image
        </h2>
        {uploaded ? (
          <img src={uploaded} alt="Original" className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-80 bg-gray-200">
            No Image Selected
          </div>
        )}
      </div>

      {/* Enhanced Image */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <h2 className="text-xl font-semibold text-center bg-blue-800 text-white py-2">
          Enhanced Image
        </h2>

        {loading && <Loading />}

        {!loading && enhanced && (
          <>
            <img src={enhanced} alt="Enhanced" className="w-full h-full object-cover" />
            <div className="flex justify-center mt-2">
              <button
                onClick={downloadImage}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Download Enhanced Image
              </button>
            </div>
          </>
        )}

        {!loading && !enhanced && (
          <div className="flex items-center justify-center h-80 bg-gray-200">
            No Enhanced Image
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;
