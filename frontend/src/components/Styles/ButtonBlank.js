import React from 'react';
import styled, { css } from 'styled-components';

const StyledButton = styled.input`
  /* 공통 스타일 */
  display: inline-block;
  outline: none;
  border-radius: 0.5rem;
  color: black;
  background-color: transparent;
  padding: 0rem 1.25rem;
  align-items: center;
  text-align: left;
  margin:  0.4rem;

  /* 크기 */
  height: 2.8rem;
  width: 16rem;
  font-size: 0.875rem;


  /* 색상 */
  ${( props ) => {
      return css`
      border: ${props.borderwidth || 1}px solid ${props.color};
      &:active {
          border: ${props.borderwidth || 1}px solid ${props.activecolor};
        }
        `;
  }}

`;


const ButtonBlank = ({  color, activecolor,  type = "text",  ...rest }) => {
    return <StyledButton 
        {...rest}
        color={color}
        activecolor={activecolor}
        type={type}
      >
      </StyledButton>;
};

export default ButtonBlank;
