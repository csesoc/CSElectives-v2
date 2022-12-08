import { Bookmark, BookmarkBorder, FlagOutlined } from "@mui/icons-material";
import { Rating } from "@mui/material";
import { IReview } from "src/interfaces/ResponseInterface";
import { mockUser } from "src/stubbing/data";
import {
  ReviewContainer,
  ReviewHeadings,
  Ratings,
  IndivRating,
  ReviewText,
  Interactions,
  InteractButton,
  RatingNumber,
  CircleFilledIcon,
  CircleEmptyIcon,
  OverallRating,
  ReviewTime,
  ReviewTitle
} from "./style";
interface Props {
  review: IReview;
}

const ReviewCard = (p: Props) => {
  const showCategoryRating = (rating: number) => {
    return (
      <Rating
        readOnly
        value={rating}
        icon={<CircleFilledIcon fontSize="inherit" />}
        emptyIcon={<CircleEmptyIcon fontSize="inherit" />}
        sx={{
          fontSize: "0.8rem",
        }}
      />
    );
  };

  const showOverallRating = (rating: number) => {
    return (
      <Rating
        readOnly
        sx={{
          "& .MuiRating-iconFilled": {
            color: "#1AC97F",
            fontSize: "1.7rem",
          },
          "& .MuiRating-iconEmpty": {
            fontSize: "1.7rem",
          },
        }}
        value={rating}
        precision={0.5}
      />
    );
  };

  const showDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  };

  // make function which shows the title of the review 
  // which will be the first sentence of the review
  // if the review is too short, then just show the first 10 characters
  const showTitle = (review: string) => {
    // show the first sentence of the review
    // which will be when the first period or new line is found
    if (review.includes(".") || review.includes(" ")) {
      return review.substring(0, review.indexOf(".") + 1);
    }
    // get the sentence before the first new line
    if (review.includes("\n")) {
      return review.substring(0, review.indexOf("\n"));
    }
  };

  return (
    <ReviewContainer>
      <ReviewHeadings>
        <div>
          <ReviewTitle>{showTitle(p.review.description)}</ReviewTitle>
        </div>
        <div>
          <ReviewTime>{showDate(p.review.createdTimestamp)}</ReviewTime>
        </div>
      </ReviewHeadings>
      <ReviewHeadings>
        <OverallRating>
          <div>Overall:</div>
          <div>{showOverallRating(p.review.overallRating)}</div>
        </OverallRating>
        <div>{p.review.zid}</div>
      </ReviewHeadings>
      <ReviewHeadings>
        <div>Term Taken: {p.review.termTaken}</div>
        <div>Grade: {p.review.grade ? p.review.grade : 'N/A'}</div>
      </ReviewHeadings>

      <Ratings>
        <IndivRating>
          <div>Enjoyment</div>
          <RatingNumber>
            {showCategoryRating(p.review.enjoyability)}
          </RatingNumber>
        </IndivRating>
        <IndivRating>
          <div>Usefulness</div>
          <RatingNumber>{showCategoryRating(p.review.usefulness)}</RatingNumber>
        </IndivRating>
        <IndivRating>
          <div>Manageability</div>
          <RatingNumber>
            {showCategoryRating(p.review.manageability)}
          </RatingNumber>
        </IndivRating>
      </Ratings>

      <ReviewText>{p.review.description}</ReviewText>

      <Interactions>
        <InteractButton>
          Did you find this helpful? ({p.review.upvotes.length})
        </InteractButton>
        <div>
          <InteractButton>
            {mockUser.bookmarkedReviews.includes(p.review) ? (
              <Bookmark />
            ) : (
              <BookmarkBorder />
            )}
          </InteractButton>
          <InteractButton>{<FlagOutlined />}</InteractButton>
        </div>
      </Interactions>
    </ReviewContainer>
  );
};

export default ReviewCard;
