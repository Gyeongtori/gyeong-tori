import React from 'react';
import styled, { css } from 'styled-components';



// const colorStyles = css`
//   ${({ props }) => {
//     return css`
//       background: ${props.color};
//       &:active {
//         background: ${props.activecolor};
//       }
//     `;
//   }}
// `;


const StyledButton = styled.button`
  /* 공통 스타일 */
  display: inline-block;
  outline: none;
  border: 1px solid #E4E7EC;
  border-radius: 0.5rem;
  color: white;
  font-weight: bold;
  padding-left: 1rem;
  padding-right: 1rem;
  align-items: center;
  text-align: center;
  margin:  0.4rem;

  /* 크기 */
  height: 3.125rem;
  width: 20rem;
  font-size: 1rem;

  /* 색상 */
  ${( props ) => {
    return css`
      background: ${props.color};
      &:active {
        background: ${props.activecolor};
      }
    `;
  }}

`;

const ButtonFull = ({ children, color, activecolor, ...rest }) => {
  return <StyledButton 
            {...rest}
            color={color}
            activecolor={activecolor}
          >{children}
          </StyledButton>;
}

ButtonFull.defaultProps = {
  color: 'white',
  activecolor : 'white'
};

export default ButtonFull;