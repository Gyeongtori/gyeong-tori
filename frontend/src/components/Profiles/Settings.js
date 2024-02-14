import React from 'react';
import styled from 'styled-components';
import { FiGrid } from "react-icons/fi";
import { FiType } from "react-icons/fi";
import { FiLock } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";

const Settings = () => {
    return (
        <div>
           <SettingBlock>
            <FiType />
            <SettingBlockContents>
                <SettingBlockText>언어설정</SettingBlockText>
                <FiChevronRight />
            </SettingBlockContents>
           </SettingBlock>
           <SettingBlock>
            <FiLock />
            <SettingBlockContents>
                <SettingBlockText>비밀번호 변경</SettingBlockText>
                <FiChevronRight />
            </SettingBlockContents>
           </SettingBlock>
           <SettingBlock>
            <FiLogOut />
            <SettingBlockContents>
                <SettingBlockText>로그아웃</SettingBlockText>
            </SettingBlockContents>
           </SettingBlock>
        </div>
    );
};


export default Settings;

const SettingBlock = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
`;

const SettingBlockText = styled.div`
  
`;

const SettingBlockContents = styled.div`
width: 100%;
  display: flex;
  justify-content: space-between;
  margin-left: 1rem;
  
`;