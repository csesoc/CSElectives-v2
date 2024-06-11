"use client";

import { Course, Courses } from "@/types/api";
import CourseCard from "../CourseCard/CourseCard";
import { useEffect, useRef, useState } from "react";
import { get } from "@/utils/request";
import { sortCourses } from "@/utils/sortCourses";
import SortDropdown from "../SortDropdown/SortDropdown";
import FilterModal from "../FilterModal.js/FilterModal";

export default function CoursesList({
  initialCourses,
  searchTerm,
}: {
  initialCourses: Course[];
  searchTerm: string;
}) {
  const courseFinishedRef = useRef(false);
  const indexRef = useRef(initialCourses.length);
  const searchCoursesRef = useRef<Course[]>([]);
  const filterCoursesRef = useRef<Course[]>([]);

  const [displayCourses, setDisplayCourses] =
    useState<Course[]>(initialCourses);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selected, setSelected] = useState("");
  const [filters, setFilters] = useState<{ faculties: []; terms: [] }>({
    faculties: [],
    terms: [],
  });
  const paginationOffset = 25;

  const loadMore = async (index: number) => {
    console.log("load more", filters);
    const fetchCourses = async () => {
      let fetchedCourses: Course[] = [];

      if (
        searchTerm !== "" ||
        filters.faculties.length !== 0 ||
        filters.terms.length !== 0
      ) {
        // searched + filtered courses
        fetchedCourses = filterCoursesRef.current.slice(index, index + 25);
      } else {
        // default courses
        try {
          const { courses } = (await get(
            `/courses?offset=${index}`
          )) as Courses;
          fetchedCourses = courses;
        } catch (err) {
          fetchedCourses = [];
        }
      }

      return fetchedCourses;
    };

    if (window.innerHeight + window.pageYOffset < document.body.offsetHeight) {
      return;
    }
    if (courseFinishedRef.current) {
      return;
    }

    const courses = await fetchCourses();
    if (courses.length === 0) {
      courseFinishedRef.current = true;
      return;
    }

    setDisplayCourses((prev) => [...prev, ...courses]);
  };

  // filters courses based on search + selected filters
  const getFilterResults = async () => {
    // if no filters then just get courses

    // if no terms/faculties
    // if (filters.terms.length === 0) {

    // }
    let terms = filters.terms.join("&");
    let faculties = filters.faculties.join("&");

    if (terms === "") {
      terms = "_";
    }
    if (faculties === "") {
      faculties = "_";
    }

    if (searchTerm === "") {
      searchTerm = "_";
    }

    // EXAMPLE URL: /course/filter/1&3/art&engineering/comp
    console.log("in courses", filters);
    console.log("terms", typeof terms);
    try {
      const { courses } = (await get(
        `/course/filter/${terms}/${faculties}/${searchTerm}`
      )) as Courses;
      filterCoursesRef.current = courses;
      console.log(courses.slice(0, 50));
    } catch (err) {
      filterCoursesRef.current = [];
    }
    setDisplayCourses(filterCoursesRef.current.slice(0, paginationOffset));
    indexRef.current += paginationOffset;
    console.log("filters", filters);
    setInitialLoading(false);
  };

  // useEffect(() => {
  //   getFilterResults();
  // }, [searchTerm, filters]);

  useEffect(() => {
    const resetRefs = () => {
      courseFinishedRef.current = false;
      indexRef.current = initialCourses.length;
      searchCoursesRef.current = [];
    };
    // const getSearchResults = async () => {
    //   try {
    //     const { courses } = (await get(
    //       `/course/search/${searchTerm}`
    //     )) as Courses;
    //     searchCoursesRef.current = courses;
    //   } catch (err) {
    //     searchCoursesRef.current = [];
    //   }
    //   setDisplayCourses(searchCoursesRef.current.slice(0, paginationOffset));
    //   indexRef.current += paginationOffset;
    //   setInitialLoading(false);
    // };

    const getInitialDisplayCourses = () => {
      if (
        searchTerm !== "" ||
        filters.faculties.length !== 0 ||
        filters.terms.length !== 0
      ) {
        getFilterResults();
      } else {
        setDisplayCourses(initialCourses.slice(0, paginationOffset));
        setInitialLoading(false);
      }
    };

    const loadOnScroll = () => {
      if (
        window.innerHeight + window.pageYOffset >= document.body.offsetHeight &&
        !courseFinishedRef.current
      ) {
        loadMore(indexRef.current);
        indexRef.current += paginationOffset;
      }
    };

    resetRefs();
    getInitialDisplayCourses();

    window.addEventListener("scroll", loadOnScroll);
    return () => window.removeEventListener("scroll", loadOnScroll);
  }, [searchTerm, filters]);

  return (
    <>
      {/* SortDropdown Bar and Filter Buttion*/}
      <div className="flex justify-end w-5/6 gap-4 xs:flex-col xs:gap-1">
        <SortDropdown selected={selected} setSelected={setSelected} />
        <FilterModal filters={filters} setFilters={setFilters} />
      </div>
      <div className="grid grid-rows-3 grid-cols-3 lg:grid-rows-1 lg:grid-cols-1 gap-12 mt-10 w-5/6 items-center">
        {sortCourses(displayCourses, selected).map(
          (c: Course, index: number) => (
            <a href={`/course/${c.courseCode}`} key={index}>
              <CourseCard
                title={c.title}
                courseCode={c.courseCode}
                overallRating={c.overallRating}
                reviewCount={c.reviewCount}
                terms={c.terms}
              />
            </a>
          )
        )}
        {!initialLoading ? (
          <p className="text-center opacity-50">No more courses</p>
        ) : (
          <p className="text-center opacity-50">Loading courses...</p>
        )}
      </div>
    </>
  );
}
