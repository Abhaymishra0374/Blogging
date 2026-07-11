import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import FeaturedBlogs from "../components/FeaturedBlogs";
import Categories from "../components/Categories";
import TrendingBlogs from "../components/TrendingBlogs";
import LatestBlogs from "../components/LatestBlogs";
import Newsletter from "../components/Newsletter";
import API from "../api/axios";

function Home() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await API.get("/blogs");
        setBlogs(res.data.blogs);
      } catch {
        setBlogs([]);
      }
    };
    fetchBlogs();
  }, []);

  const featured = blogs.slice(0, 3);
  const trending = [...blogs].sort((a, b) => b.views - a.views).slice(0, 3);
  const latest = blogs.slice(0, 4);

  return (
    <>
      <Hero />
      <FeaturedBlogs blogs={featured} />
      <Categories />
      <TrendingBlogs blogs={trending} />
      <LatestBlogs blogs={latest} />
      <Newsletter />
    </>
  );
}

export default Home;
