import { IReview } from "IReview";

export interface IHttpError {
  errorCode: number;
  errorMessage: string;
}

export interface IPostNameRequestBody {
  name: string;
}

export interface IPostNameSuccessResponse {
  nameId: string;
  fullName: string;
}

export interface IGetReviewsSuccessResponse {
  reviews: IReview[];
}
