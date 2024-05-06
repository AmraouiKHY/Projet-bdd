import React from "react";

const InventoryList = ({ products }) => {
  // Display product information in a table or list format
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
              <th className="font-bold text-[20px] px-4 py-2">Availability</th>
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
                  {product.availability}
                </td>
                <td className="font-bold text-[20px] px-4 py-2">
                  {product.description}
                </td>
                <td className="px-4 py-2">
                  {/* Display only the first image */}
                  {product.images && product.images.length > 0 && (
                    <img
                      src={`data:image/png;base64,${product.images[0].images[0]}`}
                      alt={product.name}
                      className="w-20 h-20 object-cover"
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
    </div>
  );
};

export default InventoryList;
