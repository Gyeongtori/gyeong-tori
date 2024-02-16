import { createGlobalStyle } from 'styled-components'
import GmarketLight from './GmarketSansTTFLight.woff'
import GmarketMedium from './GmarketSansTTFMedium.woff'
import GmarketBold from './GmarketSansTTFBold.woff'


export default createGlobalStyle`
  @font-face {
    font-family: "Roboto";
    src: url(${GmarketLight}) format("woff"),
         url(${GmarketMedium}) format("woff"),
         url(${GmarketBold}) format("woff");
  }

  @font-face {
    font-family: 'GmarketSansMedium';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

  @font-face {
    font-family: 'omyu_pretty';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2304-01@1.0/omyu_pretty.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
}



  @font-face {
    font-family: 'NanumSquareNeo-Variable';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_11-01@1.0/NanumSquareNeo-Variable.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
  }


`