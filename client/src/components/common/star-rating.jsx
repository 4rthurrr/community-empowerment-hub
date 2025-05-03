import React from "react";
import { StarIcon } from "lucide-react";

const StarRatingComponent = ({
  rating = 0,
  handleRatingChange = null,
  maxRating = 5,
}) => {
  const filledStars = Math.round(rating);

  const handleClick = (index) => {
    if (handleRatingChange) {
      handleRatingChange(index);
    }
  };

  return (
    <div className="flex items-center">
      {[...Array(maxRating)].map((_, index) => (
        <StarIcon
          key={index}
          size={16}
          onClick={() => handleClick(index + 1)}
          className={`${
            index < filledStars
              ? "fill-yellow-400 text-yellow-400"
              : "fill-none text-gray-300"
          } ${handleRatingChange ? "cursor-pointer" : ""}`}
        />
      ))}
    </div>
  );
};

export default StarRatingComponent;
