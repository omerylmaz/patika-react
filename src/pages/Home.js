import { useEffect, useState } from "react";
import CourseCard from "../components/CourseCart";
import courseService from "../services/courseService";
import categoryService from "../services/categoryService";
import Spinner from "../components/LoadingSpinner";
import SliderComponent from "../components/SliderComponent";
import "../css/Home.css";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [bestSellingCourses, setBestSellingCourses] = useState([]);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("fetching courses");
    fetchCategories();
    fetchCourses(pageNumber, pageSize, searchTerm, category);
    console.log("fetching best selling courses");
    fetchBestSellingCourses();
  }, [pageNumber, pageSize, searchTerm, category]);

  const fetchCourses = (page, size, term, cat) => {
    setIsLoading(true);
    if (cat === "All") {
      cat = "";
    }

    courseService
      .getPaginatedCoursesByFiltering(page, size, term, cat)
      .then((res) => {
        setCourses(res.courses.items);
        setTotalCount(res.courses.totalCount);
      })
      .catch((error) => {
        console.error(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchBestSellingCourses = async () => {
    try {
      const response = await courseService.getBestSellingCourses(6);
      console.log(response);
      setBestSellingCourses(response);
    } catch (error) {
      console.error("Failed to fetch best selling courses:", error);
    }
  };

  const fetchCategories = () => {
    categoryService.getAllCategories().then((res) => {
      setCategories(res.categories);
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPageNumber(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPageNumber(1);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const pageNumbers = [...Array(totalPages).keys()].map((n) => n + 1);

  return (
    <div className="container mt-5">
      <div className="mb-5">
        <h2 className="text-center text-primary mb-4">Best Selling Courses</h2>
        <SliderComponent bestSellingCourses={bestSellingCourses} />
      </div>

      <h1 className="text-center mb-4 text-primary">All Courses</h1>

      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Search course..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="col-md-4">
          <select
            className="form-select form-select-lg"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="d-flex justify-content-center my-5">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="row">
            {courses.map((course) => (
              <CourseCard course={course} showGoToDetails={true} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav>
              <ul className="pagination justify-content-center mt-5">
                {pageNumbers.map((number) => (
                  <li
                    key={number}
                    className={`page-item ${
                      pageNumber === number ? "active" : ""
                    }`}
                  >
                    <button
                      onClick={() => setPageNumber(number)}
                      className="page-link"
                    >
                      {number}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
