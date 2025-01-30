import os
import json
import time
from playwright.sync_api import sync_playwright
from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["eco_commerce"]
companies_collection = db["companies_test"]
products_collection = db["products"]

def fetch_companies():
    companies = list(companies_collection.find({}, {"_id": 0, "name": 1, "website": 1}))
    return companies

def extract_json_ld(page):
    scripts = page.locator("script[type='application/ld+json']").all()
    for script in scripts:
        try:
            data = json.loads(script.text_content())
            if isinstance(data, list):
                for item in data:
                    if item["@type"] == "Product":
                        return item
            elif data["@type"] == "Product":
                return data
        except json.JSONDecodeError:
            continue
    return None

def scrape_products(url):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url, timeout=60000)
        
        time.sleep(5)

        for _ in range(5):
            page.evaluate
            time.sleep(2)

        structured_data = extract_json_ld(page)
        if structured_data:
            print("Found Schema.org sturctured data")
            return [{
                "title": structured_data.get("name", "Unknown"),
                "price": structured_data.get("offers", {}).get("price", "N/A"),
                "image": structured_data.get("image", ""),
                "link": url,
                "date_added": datetime.utcnow()
            }]
        
        print("No JSON-LD found, falling back to HTML")

        possible_product_containers = ["[data-product]", ".product", ".item", ".product-card", ".card"]
        product_elements = None

        for selector in possible_product_containers:
            product_elements = page.locator(selector).all()
            if product_elements:
                print(f"Found products using selector: {selector}")
                break

        if not product_elements:
            print("No products found on page")
            return []
        
        products = []
        for product in product_elements:
            try:
                title = product.locator("css=h1, h2, h3, .title, .product-title").text_content().strip()
                price = product.locator("css=.price, .product-price, .amount").text_content().strip()
                image = product.locator("css=img").get_attribute("src")
                link = product.locator("css=a").get_attribute("href")

                # Ensure full URL for product links
                full_link = link if link.startswith("http") else url.rstrip("/") + link

                product_data = {
                    "title": title,
                    "price": price,
                    "image": image,
                    "link": full_link,
                    "date_added": datetime.utcnow()
                }
                products.append(product_data)
                print(f"🛍️ Found Product: {product_data}")
            except Exception as e:
                print(f"⚠️ Error extracting product data: {e}")

        browser.close()
        return products
    
def store_products(products):
    for product in products:
        if not products_collection.find_one({"link": product["link"]}):
            products_collection.insert_one(product)
            print(f"Added product: {product['title']}")
        else:
            print(f"Skipping duplicate product: {product['title']}")

def main():
    companies = fetch_companies()
    for company in companies:
        print(f"Scraping {company['name']} - {company['website']}")
        products = scrape_products(company["website"])
        store_products(products)

if __name__ == "__main__":
    main()