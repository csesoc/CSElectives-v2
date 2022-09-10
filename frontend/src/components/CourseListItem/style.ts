import style from "styled-components";

export const CourseListItemContainer = style.div`
    display: flex;
    width: 75%;
    height: 5%;
    // border: 1px solid black;
    border-bottom: 1px solid #C6C6C6;
    padding: .3%;
    font-size: .8rem;
    font: Lato;
    // padding-top: .8%;
    // padding-bottom: .8%;
    align-items: center;
`;

export const CourseCode = style.div`
    width: 8%;
    height: 100%;
    text-align: left;
    // border: 1px solid red;
    font-weight: bold;

`;

export const CourseName = style.div`
    width: 20%;
    height: 100%;
    text-align: left;
    // border: 1px solid green;
`;

export const Terms = style.div`
    width: 25%;
    height: 100%;
    text-align: left;
    // border: 1px solid blue;
`;

export const OverallRating = style.div`
    width: 15.5%;
    height: 100%;
    text-align: left;
    // border: 1px solid yellow
`;

export const Enjoyability = style.div`
    width: 6%;
    height: 100%;
    text-align: center;
    // border: 1px solid purple;

`;

export const Usefulness = style.div`
    width: 6%;
    height: 100%;
    text-align: center;
    // border: 1px solid orange;

`;

export const Manageability = style.div`
    width: 6%;
    height: 100%;
    text-align: center;
    // border: 1px solid pink;

`;

export const FacultyContainer = style.div`
    width: 10%;
    height: 100%;
    text-align: left;
    // border: 1px solid lightblue;
    padding-bottom: .2%;
    
    

`;

export const Faculty = style.div`
    display: initial;
    width: 100%;
    height: 100%;
    border-radius: 7px;
    padding-left: 5%;
    padding-right: 5%;
    padding-bottom: 2%;

    background-color: #E8D3F4;
`;

export const ReviewCount = style.div`
    width: 7%;
    height: 100%;
    text-align: center;
    // border: 1px solid lightgreen;
`;