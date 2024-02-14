package org.jackpot.back.culturalHeritage.model.service;

import org.jackpot.back.culturalHeritage.model.entity.CulturalHeritage;
import org.jdom2.JDOMException;

import java.io.IOException;

public interface WebClientService {
    //문화재 검색
    void search() throws IOException, JDOMException;
    //문화재 검색 상세조회
    void detailSearch(String ccbaKdcd, String ccbaAsno, String ccbaCtcd) throws IOException, JDOMException;
    //문화재 이미지 검색
    void imageSearch(String ccbaKdcd, String ccbaAsno, String ccbaCtcd) throws IOException, JDOMException;
    //문화재 동영상 검색
    void videoSearch(String ccbaKdcd, String ccbaAsno, String ccbaCtcd) throws IOException, JDOMException;
    //문화재 나레이션 검색
    void voiceSearch(String ccbaKdcd, String ccbaAsno, String ccbaCtcd, String ccbaGbn) throws IOException, JDOMException;
}
