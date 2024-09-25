from bs4 import BeautifulSoup
import requests
import sys
import json

def get_video_keywords(video_url):
    try:
        # Send a request to the video URL
        response = requests.get(video_url)
        if response.status_code == 200:
            # Parse the HTML content
            soup = BeautifulSoup(response.text, 'html.parser')
            # Find the <meta> tag that contains the keywords
            keywords_meta = soup.find("meta", {"name": "keywords"})
            if keywords_meta:
                keywords = keywords_meta.get("content", "").split(",")
                return [keyword.strip() for keyword in keywords]
            else:
                return []
        else:
            print(f"Failed to retrieve video. Status code: {response.status_code}")
            return []
    except Exception as e:
        print(f'Error fetching video keywords: {e}')
        return []

if __name__ == "__main__":
    video_url = sys.argv[1]  # Get URL from command-line arguments
    keywords = get_video_keywords(video_url)
    print(json.dumps(keywords))  # Output keywords in JSON format
