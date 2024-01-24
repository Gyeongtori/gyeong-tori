import { useEffect, useState } from "react";
import Header from "../components/Cards/Header";
import Search from "../components/Cards/Search";
import MultiFilter from "../components/Searchs/MultiFilter";

const SearchPage = () => {
  return (
    <>
      <Header />
      <Search />
      <MultiFilter />
    </>
  )
}
export default SearchPage;