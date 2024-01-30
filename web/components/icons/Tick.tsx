import React from "react";

export type BtnSize = { width: string; height: string; vBox: string };

const Tick = ({
  variant = "gray",
  size,
}: {
  variant?: "gray" | "green" | "red" | "blue";
  size?: string;
}) => {
  let colorFill = "";
  switch (variant) {
    case "gray":
      colorFill = "#0A0A0C57";
      break;
    case "green":
      colorFill = "#458A59";
      break;
    case "red":
      colorFill = "#EF4444";
    case "blue":
      colorFill = "#2C75D3";
      break;
  }
  let btnSize: BtnSize = {} as BtnSize;
  switch (size) {
    case "lg":
      btnSize = { width: "24", height: "24", vBox: "0 0 24 24" };
      break;

    default:
      btnSize = { width: "19", height: "18", vBox: "0 0 19 18" };
  }
  //   console.log(variant);
  return (
    <svg
      width={btnSize.width}
      height={btnSize.height}
      viewBox={btnSize.vBox}
      fill={colorFill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="check_circle_FILL1_wght400_GRAD0_opsz48 1">
        <path
          id="Vector"
          d="M8.39375 12.4125L13.7 7.10625L12.8375 6.2625L8.39375 10.7062L6.14375 8.45625L5.3 9.3L8.39375 12.4125ZM9.5 16.5C8.475 16.5 7.50625 16.3031 6.59375 15.9094C5.68125 15.5156 4.88437 14.9781 4.20312 14.2969C3.52187 13.6156 2.98437 12.8187 2.59062 11.9062C2.19687 10.9937 2 10.025 2 9C2 7.9625 2.19687 6.9875 2.59062 6.075C2.98437 5.1625 3.52187 4.36875 4.20312 3.69375C4.88437 3.01875 5.68125 2.48437 6.59375 2.09062C7.50625 1.69687 8.475 1.5 9.5 1.5C10.5375 1.5 11.5125 1.69687 12.425 2.09062C13.3375 2.48437 14.1312 3.01875 14.8062 3.69375C15.4812 4.36875 16.0156 5.1625 16.4094 6.075C16.8031 6.9875 17 7.9625 17 9C17 10.025 16.8031 10.9937 16.4094 11.9062C16.0156 12.8187 15.4812 13.6156 14.8062 14.2969C14.1312 14.9781 13.3375 15.5156 12.425 15.9094C11.5125 16.3031 10.5375 16.5 9.5 16.5Z"
        />
      </g>
    </svg>
  );
};

export default Tick;
