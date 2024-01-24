import { useEffect, useState } from "react";
import Header from "../components/Cards/Header";
import Search from "../components/Cards/Search";
import MultiFilter from "../components/Searchs/MultiFilter";

const SearchPage = () => {
  const [selectedTags, setSelectedTags] = useState([]);

  // MultiFilter 컴포넌트로 전달할 콜백 함수
  const handleStatusChange = (newPassingTags) => {
    // 선택된 태그 중 status가 true인 것들만 필터링하여 배열로 저장
    const selected = newPassingTags.filter((tag) => tag.status === true);
    setSelectedTags(selected);
  };
  return (
    <>
      <Header />
      <Search selectedTags={selectedTags}/>
      <MultiFilter handleStatusChange={handleStatusChange}/>
    </>
  )
}
export default SearchPage;