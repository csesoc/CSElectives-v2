from bs4 import BeautifulSoup
import json
import requests

# Get all course codes from localhost:3030/api/v1/courses/code/all
url = "http://localhost:3030/api/v1/courses/code/all"
response = requests.get(url)
courses = response.json()

course_codes = courses
url_prefix = "https://studentvip.com.au/unsw/subjects/"
reviews = []


for course_code in course_codes:
    page = requests.get(url_prefix + course_code)
    soup = BeautifulSoup(page.content, "html.parser")

    try:
        res = soup.find("h3", class_="text-subjects") \
        .find_next(class_="list-group") \
        .find_all(class_="panel-body")

        course_reviews = []

        for review in res:
            review_object = {}
            review_object["rating"] = len(review.find_all("i", class_="fa fa-star"))
            review_object["description"] = review.find("p").get_text(strip=True)

            name, term, year = review.find("small").get_text(strip=True).split(",")
            review_object["authorName"] = name.strip()
            termTaken = term.split(' ')
            yearTaken = year.strip()
            # Will format according to how backend wants (18S1, 19T2 Automatically changes to S and T)
            review_object["termTaken"] = yearTaken[2:] + termTaken[1][0] + termTaken[2]

            course_reviews.append(review_object)

        if course_reviews:
            reviews.append({
                "course": course_code,
                "reviews": course_reviews
            })
    except:
        print(f"Could not process reviews for {course_code}")

    with open('../backend/data/studentVIP_reviews.json', 'w') as f:
        json.dump(reviews, f, indent=2)