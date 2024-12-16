import pymongo.errors
from selenium import webdriver
from selenium.webdriver.common.by import By
import pymongo

def scrape_ecoternatives(driver, url, db):
  options = webdriver.ChromeOptions()
  options.add_argument("--headless")  # Optional: Run in headless mode

  # Load the page
  base_url = "https://ecoternatives.co/"  # Replace with the actual URL
  driver.get(url)  

  # Locate all product cards
  products = driver.find_elements(By.CLASS_NAME, "lh-product-item")

  for product in products:
    try:
        # Extract product details
        title = product.find_element(By.CLASS_NAME, "lh-wrap-swap").text.strip()
        price = product.find_element(By.CLASS_NAME, "lh-product-price").text.strip()
        url = product.find_element(By.TAG_NAME, "a").get_attribute("href")
        image = product.find_element(By.CLASS_NAME, "lh-product-item-images").find_element(By.TAG_NAME, "img").get_attribute("src")

        # Create a new dictionary for each product
        product_data = {
            "title": title,
            "summary": title,
            "price": price,
            "url": url,
            "image": image,
            "source": "ecoternatives",
            "visible": False
        }

        # Insert the product into MongoDB
        print(f"Inserting products: {product_data}")
        db.products.insert_one(product_data)

    except pymongo.errors.DuplicateKeyError as e:
        print(f"Duplicate Key Error: {e}")
    except Exception as e:
        print(f"Error extracting product data: {e}")