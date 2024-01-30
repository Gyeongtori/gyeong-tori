import React from 'react';
import styled, { css } from 'styled-components';

const StyledButton = styled.input`
  /* 공통 스타일 */
  display: inline-block;
  outline: none;
  border-radius: 0.5rem;
  color: #C8C8C8;
  background-color: transparent;
  padding: 0rem 1.25rem;
  align-items: center;
  text-align: left;
  margin:  0.4rem;

  /* 크기 */
  height: 3.125rem;
  width: 17.5rem;
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


const ButtonBlank = ({  color, activecolor, borderwidth,  ...rest }) => {
    return <StyledButton 
        {...rest}
        color={color}
        activecolor={activecolor}
        borderwidth={borderwidth}
       
      >
      </StyledButton>;
};

export default ButtonBlank;
