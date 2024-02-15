import React, { useState } from 'react';
import { MdOutlineLanguage } from "react-icons/md";
import styled from 'styled-components';

const LanguageDropDown = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [ariticleType, setArticleType] = useState('전체');
    const articleTypeList = ['한국어', 'English'];

    const articleBtnExpandHandler = () => {
        setIsExpanded(!isExpanded);
    };

    const articleTypeHandler = (data) => {
        setArticleType(data);
    };
    
    return (
        <div>
            {!isExpanded && (
            <LanguageBtn onClick={articleBtnExpandHandler}>
              <MdOutlineLanguage />
              <LanguageTitle>{ariticleType}</LanguageTitle>
            </LanguageBtn>
          )}

          {isExpanded && (
            <LanguageBtnList onClick={articleBtnExpandHandler}>
              {articleTypeList.map((type, idx) => (
                <LanguageBtnList key={type} onClick={() => articleTypeHandler(type)}>
                  <MdOutlineLanguage />
                  {type}
                </LanguageBtnList>
              ))}
            </LanguageBtnList>
          )}

        </div>
    );
};

export default LanguageDropDown;


const LanguageBtn = styled.div`
  width: 100px;
  height: 50px;
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

`