import "./BlogSearch.scss";
import React, { useState } from "react";
import { useGetBlogsBySearchQuery } from "../../context/api/blogApi";

const BlogSearch = () => {
  const [search, setSearch] = useState("");
  let { data, isError } = useGetBlogsBySearchQuery({ value: search });
  console.log(data);

  return (
    <div className="blog-search">
      <form action="">
        <input
          onChange={(e) => setSearch(e.target.value)}
          placeholder={"search"}
          value={search}
          type="text"
        />
        <button>Search</button>
      </form>
      {search ? (
        <div>
          {isError ? (
            <div className="blog-search-not">Not found</div>
          ) : (
            <div className="blog-search-info">
              {data?.payload?.map((el) => (
                <div className="blog-search-info-frame">
                  <p>{el.title}</p>
                  <p>{el.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default BlogSearch;
