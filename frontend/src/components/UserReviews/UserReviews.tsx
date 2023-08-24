"use client";

import { Review, Reviews } from "@/types/api";
import Dropdown from "../Dropdown/Dropdown";
import { useEffect, useMemo, useState } from "react";
import Rating from "../Rating/Rating";
import { ArrowSmallUpIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as SolidBookmarkIcon } from "@heroicons/react/24/solid";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import EditReviewModal from "../EditReviewModal/EditReviewModal";
import Pagination from "../Pagination/Pagination";
import RemoveReviewModal from "../RemoveReviewModal/RemoveReviewModal";
import { post } from "@/utils/request";
import { useSession } from "next-auth/react";

export default function UserReviews({
  reviews,
  bookmarked,
}: Reviews & { bookmarked: Review[] }) {
  const [currentReviews, setCurrentReviews] = useState(reviews);
  const [bookmarkedReviews, setBookmarkedReviews] = useState(bookmarked);
  const [selected, setSelected] = useState("");
  const [cardView, setCardView] = useState(true);
  const [deleted, setDeleted] = useState<string>();
  const [edited, setEdited] = useState<{
    reviewId: string;
    authorName: string;
    grade: number | null;
  }>();
  const [page, setPage] = useState(1);
  const { data: session, status } = useSession();
  const itemPerPage = 9;

  // Change review sorting based on dropdown
  useMemo(() => {
    const sortedReviews = [...reviews];
    switch (selected) {
      case "Most Recent":
        sortedReviews.sort(
          (r1: Review, r2: Review) =>
            Date.parse(r2.createdTimestamp) - Date.parse(r1.createdTimestamp),
        );
        break;
      case "Most Recently Taken":
        sortedReviews.sort((r1: Review, r2: Review) =>
          r2.termTaken.localeCompare(r1.termTaken),
        );
        break;
      case "Highest Rating to Lowest Rating":
        sortedReviews.sort(
          (r1: Review, r2: Review) => r2.overallRating - r1.overallRating,
        );
        break;
      case "Lowest Rating to Highest Rating":
        sortedReviews.sort(
          (r1: Review, r2: Review) => r1.overallRating - r2.overallRating,
        );
        break;
    }

    setCurrentReviews(sortedReviews);
  }, [selected, reviews]);

  // Bookmark review
  const bookmarkReview = async (review: Review, isBookmark: boolean) => {
    if (isBookmark) {
      const newBookmarked = [...bookmarkedReviews].filter(
        (r: Review) => r.reviewId !== review.reviewId,
      );
      setBookmarkedReviews(newBookmarked);
    } else {
      const newBookmarked = [...bookmarkedReviews];
      newBookmarked.push(review);
      setBookmarkedReviews(newBookmarked);
    }
    const body = {
      reviewId: review.reviewId,
      zid: session?.user?.id,
      bookmark: !isBookmark,
    };
    await post("/reviews/bookmark", body);
  };

  const upvoteReview = async (review: Review) => {
    const body = {
      reviewId: review.reviewId,
      zid: session?.user?.id,
      upvote: true,
    };
    await post("/reviews/upvote", body);
  };

  useEffect(() => {
    if (!deleted) return;
    // Optimistic UI update for deleting a review
    const newReviews = currentReviews.filter(
      (review) => review.reviewId !== deleted,
    );
    setCurrentReviews(newReviews);
  }, [deleted]);

  useEffect(() => {
    if (!edited) return;
    // Optimistic UI update for deleting a review
    const newReviews = [...currentReviews];
    const target = newReviews.find(
      (review) => review.reviewId === edited.reviewId,
    );
    if (!target) return;
    target.authorName = edited.authorName;
    target.grade = edited.grade;
    console.log(newReviews);
    setCurrentReviews(newReviews);
  }, [edited]);

  return (
    <div className="space-y-5 isolate">
      <div className="flex flex-wrap items-center gap-5 justify-between">
        {/* Review order */}
        <div className="min-w-[275px] max-w-[275px] sm:min-w-full [&>*]:z-10">
          <Dropdown
            options={[
              "Most Recent",
              "Most Recently Taken",
              "Highest Rating to Lowest Rating",
              "Lowest Rating to Highest Rating",
            ]}
            placeholder="Sort by"
            defaultValue={selected}
            onChange={setSelected}
          />
        </div>
        {/* Toggle Switch */}
        <div className="flex ml-auto gap-2">
          <span>Card</span>
          <div className="-scale-1">
            <ToggleSwitch
              accessibleTitle="card-list-view"
              defaultValue={cardView}
              onChange={setCardView}
            />
          </div>
          <span>List</span>
        </div>
      </div>
      {/* Reviews */}
      {/* List view */}
      {!cardView && (
        <div>
          {currentReviews
            .slice((page - 1) * itemPerPage, page * itemPerPage)
            .map((review: Review, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center gap-2 sm:flex-wrap border border-transparent border-b-black/25 px-4 py-4"
              >
                <div className="flex w-1/2 sm:w-full sm:flex-col sm:items-start items-center gap-2">
                  {/* Title */}
                  <h1 className="font-bold text-xl">{review.courseCode}</h1>
                  {/* Description */}
                  <p className="text-unilectives-headings w-full truncate">
                    {!review.description ? "-" : review.description}
                  </p>
                </div>
                {/* Icons */}
                <div className="flex flex-1 flex-wrap gap-5 justify-end">
                  <EditReviewModal review={review} setEdited={setEdited} />
                  <RemoveReviewModal review={review} setDeleted={setDeleted} />
                </div>
              </div>
            ))}
        </div>
      )}
      {/* Card view */}
      {cardView && (
        <div className="grid grid-cols-3 lg:grid-cols-1 gap-12">
          {currentReviews
            .slice((page - 1) * itemPerPage, page * itemPerPage)
            .map((review: Review, index: number) => (
              <div
                key={index}
                className="box-border isolate px-6 py-7 bg-unilectives-card shadow-lg rounded-xl space-y-4"
              >
                {/* Course courseCode + Ratings */}
                <div className="flex flex-wrap justify-between text-2xl">
                  <h1 className="font-bold block truncate">
                    {review.courseCode}
                  </h1>
                  <div className="text-right">
                    {/* StarRating */}
                    <div className="text-2xl inline">
                      <Rating
                        color="purple"
                        type="star"
                        overallRating={review.overallRating}
                      />
                    </div>
                  </div>
                </div>
                {/* Description */}
                <p className="text-unilectives-headings break-all line-clamp-3 h-[4.5rem]">
                  {!review.description ? "-" : review.description}
                </p>
                {/* Icons */}
                <div className="flex flex-wrap ml-auto gap-5 w-fit">
                  <EditReviewModal review={review} setEdited={setEdited} />
                  <RemoveReviewModal review={review} setDeleted={setDeleted} />
                </div>
              </div>
            ))}
        </div>
      )}
      {/* Pagination */}
      <Pagination
        totalItems={reviews.length}
        itemPerPage={itemPerPage}
        onPageChange={(page: number) => setPage(page)}
      />
    </div>
  );
}