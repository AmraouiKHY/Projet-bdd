import React, { useState } from "react";

const InventoryList = ({ products }) => {

  const [selectedImage, setSelectedImage] = useState(null);

  const openImageModal = (imageData) => {
    setSelectedImage(imageData);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="mt-4">
      <h2 className="font-bold text-[20px]">Inventory List</h2>
      {products.length > 0 ? (
        <table className="table-auto w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left text-sm font-medium">
              <th className="font-bold text-[20px] px-4 py-2">Name</th>
              <th className="font-bold text-[20px] px-4 py-2">Price</th>
              <th className=" font-bold text-[20px] px-4 py-2">Color</th>
              <th className="font-bold text-[20px] px-4 py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-gray-300 hover:bg-gray-100"
              >
                <td className="font-bold text-[20px] px-4 py-2">
                  {product.name}
                </td>
                <td className="font-bold text-[20px] px-4 py-2">
                  {product.price}
                </td>
                <td className="font-bold text-[20px] px-4 py-2">
                  {product.color}
                </td>
             
                <td className="font-bold text-[20px] px-4 py-2">
                  {product.description}
                </td>
                <td className="px-4 py-2">
            {product.images && product.images.length > 0 && (
              <img
                src={`data:image/png;base64,${product.images[0].data}`}
                alt={product.name}
                className="w-20 h-20 object-cover cursor-pointer"
                onClick={() => openImageModal(product.images[0].data)}
              />
            )}
          </td>
              </tr>
            ))}
          </tbody>
        </table>
        
      ) : (
        <p className="text-gray-500 font-bold text-[20px]">
          No products in inventory yet.
        </p>
      )}

            {/* Image modal */}
            {selectedImage && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4">
            <button onClick={closeImageModal}>Close</button>
            <img src={`data:image/png;base64,${selectedImage}`} alt="Selected" className="w-full h-auto" />
          </div>
        </div>
      )}
      
    </div>
  );
};

export default InventoryList;
