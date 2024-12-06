import requests

API_KEY = "1234"
BASE_URL = "https://openapi.etsy.com/v3/application/"

def search_etsy_products(query):
    url = f"{BASE_URL}listings/active"
    params = {
        "keywords": query,
        "limit": 50,
        "includes": "Images,Shop"
    }
    headers = {
        "x-api-key": API_KEY
    }
    response = requests.get(url, params=params, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}, {response.text}")
        return None

# Example Search
products = search_etsy_products("eco-friendly products")
for product in products["results"]:
    print(f"Title: {product['title']}, Price: {product['price']}, {product['currency_code']}")
