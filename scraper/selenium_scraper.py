from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
import time
from pymongo import MongoClient


# Selenium Scraper Class
class ProductScraper:
    def __init__(self):
        # Configure Chrome options
        options = Options()
        options.add_argument("--start-maximized")
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_argument("--headless")
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=options)


        self.client = MongoClient("mongodb://localhost:27017/")
        self.db = self.client["eco_commerce"]
        self.collection = self.db["products"]

    def scrape_amazon(self, url):
        self.driver.get(url)
        time.sleep(3)

        products = []

        try:
            # Locate product containers
            product_elements = self.driver.find_elements(By.CSS_SELECTOR, ".s-main-slot .s-result-item[data-component-type='s-search-result']")

            for product in product_elements:
                try:
                    title_element = product.find_elements(By.CSS_SELECTOR, "h2 a span")
                    title = title_element[0].text if title_element else "No title available"

                    # Extract product link
                    link_element = product.find_elements(By.CSS_SELECTOR, "h2 a")
                    link = link_element[0].get_attribute("href") if link_element else "No link available"

                    # Add product details to the list
                    product_data = {
                        "title": title,
                        "link": link,
                    }
                    self.collection.insert_one(product_data)
                    print(f"Inserted product: {product_data}")
                except Exception as e:
                    print(f"Error extracting product: {e}")
        except Exception as e:
            print(f"Error loading Amazon page: {e}")

        return products
    
    def close(self):
        self.driver.quit()
        self.client.close()

if __name__ == "__main__":
    # URL for an Amazon search results page (e.g., "eco-friendly products")
    url = "https://www.amazon.com/s?k=eco+friendly+products&s=date-desc-rank&crid=31S002JHWLDUT&qid=1733427841&sprefix=eco+friendly+prod%2Caps%2C147&ref=sr_st_date-desc-rank&ds=v1%3A%2F%2BojAuro%2B%2FYwnq%2B57eLW4jIeVVGJC2qdrH6IUH6R4mU"  # Update with desired search query

    # Initialize the scraper
    scaper = ProductScraper()
    try:
        products = scaper.scrape_amazon(url)
    finally:
        scaper.close()