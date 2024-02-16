import React, { useState } from 'react';
import { MdOutlineLanguage } from "react-icons/md";
import styled from 'styled-components';

const LanguageDropDown = ({ language, setLanguage }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const articleTypeList = ['한국어', 'English'];

    const articleBtnExpandHandler = () => {
        setIsExpanded(!isExpanded);
    };

    const articleTypeHandler = (data) => {
        setLanguage(data);
    };
    
    return (
        <LanguageBlock>
            {!isExpanded && (
            <LanguageBtn onClick={articleBtnExpandHandler}>
              <MdOutlineLanguage />
              <LanguageTitle>{language}</LanguageTitle>
            </LanguageBtn>
          )}

          {isExpanded && (
            <LanguageBtnList onClick={articleBtnExpandHandler}>
              {articleTypeList.map((type, idx) => (
                <LanguageBtn key={type} onClick={() => articleTypeHandler(type)}>
                  <MdOutlineLanguage />
                  {type}
                </LanguageBtn>
              ))} 
            </LanguageBtnList>
          )}

        </LanguageBlock>
    );
};

export default LanguageDropDown;

const LanguageBlock = styled.div`
  margin: 2rem 1rem;
`;

const LanguageBtn = styled.div`
  width: 100px;
  height: 35px;
  background-color: #758467;
  color: white;
  border-radius: 10px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const LanguageTitle = styled.div`
  
`;

const LanguageBtnList = styled.div`
    width: 100px;
  height: 50px;
  background-color: #758467;
  color: white;
  border-radius: 10px;
`