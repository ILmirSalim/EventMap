import React from "react";

type PointsProps = {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const PointsComponent: React.FC<PointsProps> = ({ handleChange }) => {
  return (
    <div className="flex">
      <div>
        <input
          type="radio"
          id="rating1"
          name="rating"
          value="1"
          onChange={handleChange}
        />
        <label className="pl-[5px] pr-[5px]" htmlFor="rating1">
          1
        </label>
      </div>
      <div>
        <input
          type="radio"
          id="rating2"
          name="rating"
          value="2"
          onChange={handleChange}
        />
        <label className="pl-[5px] pr-[5px]" htmlFor="rating2">
          2
        </label>
      </div>
      <div>
        <input
          type="radio"
          id="rating3"
          name="rating"
          value="3"
          onChange={handleChange}
        />
        <label className="pl-[5px] pr-[5px]" htmlFor="rating3">
          3
        </label>
      </div>
      <div>
        <input
          type="radio"
          id="rating4"
          name="rating"
          value="4"
          onChange={handleChange}
        />
        <label className="pl-[5px] pr-[5px]" htmlFor="rating4">
          4
        </label>
      </div>
      <div>
        <input
          type="radio"
          id="rating5"
          name="rating"
          value="5"
          onChange={handleChange}
        />
        <label className="pl-[5px] pr-[5px]" htmlFor="rating5">
          5
        </label>
      </div>
    </div>
  );
};

export default PointsComponent;
