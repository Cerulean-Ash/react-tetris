import React from "react";
import { StyledButton } from "./styles/StyledButton";

const SpecialButton = ({ callback }) => (
  <StyledButton onClick={callback}>Secret Level</StyledButton>
);

export default SpecialButton;
