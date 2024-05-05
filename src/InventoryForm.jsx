import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Rating } from "react-simple-star-rating";

const InventoryForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [rating, setRating] = useState(0);
const handleRating = (rate) => {
    setRating(rate);
};
  const onPointerEnter = () => console.log("Enter");
  const onPointerLeave = () => console.log("Leave");
const onPointerMove = (value, index) =>
    console.log(value, index);

  const [name, setName] = useState("");
  const [id, setId] = useState(""); // Generate unique IDs on server-side
  const [price, setPrice] = useState(0.0);
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [weight, setWeight] = useState(0.0);
  const [quantite,setQuantite] = useState(0.0);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "name":
        setName(value);
      case "price":
        setPrice(parseFloat(value));
      case "color":
        setColor(value);
      case "description":
        setDescription(value);
      case "commentaire":
        setCommentaire(value);
    case "weight":
        setWeight(parseFloat(value)); 
    case "quantite":
        setQuantite(parseFloat(value));
      default:
    }
  };

  const handleFormSubmit = (data) => {
    // Call a function (e.g., `submitProduct`) to send data to your server for storage
    onSubmit(data);
    setName("");
    setPrice(0.0);
    setColor("");
    setDescription("");
    setCommentaire("");
    setWeight(0.0);
    setQuantite(0.0)
  };

  return (
    
    <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
      <h2 className="text-xl font-bold">Product Information</h2>
      <div className="flex flex-row ">
        <div className="flex items-center">
          <label htmlFor="name" className="w-20 mr-2 text-right">
            Name:{" "}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleInputChange}
            {...register("name", { required: true })}
            className="w-full rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">Name is required</span>
          )}
        </div>
        <div className="flex items-center">
          <label htmlFor="price" className="w-20 mr-2 text-right">
            Price:{" "}
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={price}
            onChange={handleInputChange}
            {...register("price", { required: true, min: 0 })}
            className="w-full rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.price && (
            <span className="text-red-500 text-sm">
              Price is required and must be positive
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center">
        <label htmlFor="color" className="w-20 mr-2 text-right">
          Color:{" "}
        </label>
        <input
          type="text"
          id="color"
          name="color"
          value={color}
          onChange={handleInputChange}
          className="w-full rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center">
        <label htmlFor="weight" className="w-20 mr-2 text-right">
          Weight:{" "}
        </label>
        <input
          type="number"
          id="weight"
          name="weight"
          value={weight}
          onChange={handleInputChange}
          className="w-full rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center">
        <label htmlFor="Quantite" className="w-20 mr-2 text-right">
          Quantite:{" "}
        </label>
        <input
          type="text"
          id="quantite"
          name="quantite"
          value={quantite}
          onChange={handleInputChange}
          className="w-full rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center">
        <label htmlFor="description" className="w-20 mr-2 text-right">
          Description:{" "}
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={handleInputChange}
          className="w-full rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
        ></textarea>
      </div>
      <div className="flex items-center">
        <label htmlFor="commentaire" className="w-20 mr-2 text-right">
          Commentaire:{" "}
        </label>
        <textarea
          id="commentaire"
          name="commentaire"
          value={commentaire}
          onChange={handleInputChange}
          className="w-full rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
        ></textarea>
      </div>
      <div className="flex">
        <h2 className="">Rating</h2>
        <Rating
          onClick={handleRating}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          onPointerMove={onPointerMove}
          /* Available Props */
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Submit Product
      </button>
    </form>
  );
};



export default InventoryForm;
