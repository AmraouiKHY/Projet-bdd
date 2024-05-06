import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Rating } from "primereact/rating";
        
const InventoryForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    
  } = useForm();


  const [name, setName] = useState("");
  const [price, setPrice] = useState(0.0);
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [weight, setWeight] = useState(0.0);
  const [quantite, setQuantite] = useState(0.0);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "name":
        setName(value);
        break;
      case "price":
        setPrice(parseFloat(value));
        break;
      case "color":
        setColor(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "commentaire":
        setCommentaire(value);
        break;
      case "weight":
        setWeight(parseFloat(value));
        break;
      case "quantite":
        setQuantite(parseFloat(value));
        break;
      default:
        break;
    }
  };
  const [value, setValue] = useState(null);
  const handleFormSubmit = async (data, e) => {
    // Prevent the default form submission behavior
    e.preventDefault();
  
    // Create a FormData object to hold the form values
    const formData = new FormData();
  
    // Append the form values to the FormData object
    formData.append('name', name);
    formData.append('price', price);
    formData.append('color', color);
    formData.append('description', description);
    formData.append('commentaire', commentaire);
    formData.append('weight', weight);
    formData.append('quantite', quantite);
  
    // If there's a file selected, append it to the FormData object
    const pictureInput = document.querySelector('#picture');
    if (pictureInput.files[0]) {
      formData.append('picture', pictureInput.files[0]);
    }
  
    try {
      // Make the HTTP request to your server endpoint
      const response = await fetch('/api/products', { // Adjust the URL to your specific endpoint
        method: 'POST',
        body: formData, // Send the FormData object as the request body
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Handle the response from the server
      const result = await response.json();
      console.log('Product submitted successfully:', result);
  
      // Optionally, clear the form fields after successful submission
      setName("");
      setPrice(0.0);
      setColor("");
      setDescription("");
      setCommentaire("");
      setWeight(0.0);
      setQuantite(0.0);
      if (pictureInput) {
        pictureInput.value = ''; // Reset file input
      }
  
      // Call any additional logic upon successful submission, if necessary
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };

return (
  <>
    <div>
      <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
        <h2 className="text-xl font-bold">Product Information</h2>
        <div className="flex space-x-24 justify-between items-center">
          <div className="flex items-center">
            <label
              htmlFor="name"
              className="font-bold text-[20px] mr-8 text-right"
            >
              Name:{" "}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleInputChange}
              {...register("name", { required: true })}
              className="w-[520px] rounded-md border border-gray-300 px-2 py-1"
            />
            {errors.name && (
              <span className="text-red-500 font-bold text-[20px]">
                Name is required
              </span>
            )}
          </div>
          <div className="flex items-center">
            <label
              htmlFor="price"
              className="font-bold text-[20px] mr-2 text-right"
            >
              Price:{" "}
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={price}
              onChange={handleInputChange}
              {...register("price", { required: true, min: 0 })}
              className="w-[520px] rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.price && (
              <span className="text-red-500 text-sm">
                Price is required and must be positive
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-between ">
          <div className="flex items-center">
            <label htmlFor="color" className="font-bold text-[20px] w-20 mr-4 ">
              Color:{" "}
            </label>
            <input
              type="text"
              id="color"
              name="color"
              value={color}
              onChange={handleInputChange}
              className="w-[520px] rounded-md border  border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
       
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <label
              htmlFor="Quantite"
              className="font-bold text-[20px] w-20 mr-4"
            >
              Quantite:{" "}
            </label>
            <input
              type="text"
              id="quantite"
              name="quantite"
              value={quantite}
              onChange={handleInputChange}
              className="w-[520px] rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <div>
              <label
                htmlFor="picture"
                className="font-bold text-[20px] w-20 mr-2 text-right"
              >
                Picture:
              </label>
              <input
                type="file"
                id="picture"
                name="picture"
                onChange={handleInputChange}
                className="w-[520px] rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <label
            htmlFor="description"
            className="font-bold text-[20px] w-20 mr-14 "
          >
            Description:{" "}
          </label>
          <input
            id="description"
            name="description"
            value={description}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></input>
        </div>



        <button
          type="submit"
          className="bg-blue-500 text-white font-bold text-[20px] px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Submit Product
        </button>
      </form>
    </div>
  </>
);
};

export default InventoryForm;
