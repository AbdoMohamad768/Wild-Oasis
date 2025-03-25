import styled from "styled-components";

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;

  & div {
    cursor: pointer;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      width: 14px;
      height: 14px;
      border: 2px solid #888;
      border-radius: 4px;
      margin-top: -9px;
      transition: 0.3s;
    }

    &:hover::before {
      border-color: var(#0075ff);
    }

    &::after {
      /* content: "\f00c"; */
      content: "I";
      font-weight: 900;
      position: absolute;
      left: 0px;
      top: 50%;
      margin-top: -9px;
      background-color: #0075ff;
      border-radius: 4px;
      color: white;
      font-size: 12px;
      width: 18px;
      height: 18px;
      display: flex;
      justify-content: center;
      align-items: center;
      transform: scale(0) rotate(360deg);
      transition: 0.3s;
    }
  }

  & input:checked + label::after {
    transform: scale(1);
  }
`;

// const StyledCheckbox = styled.input``;

function CustomCheckbox({ label, id }) {
  return <CheckboxContainer></CheckboxContainer>;
}

export default CustomCheckbox;
