from selenium.webdriver.common.by import By
import time
from dbHelper import insert_product

def scrape_amazon(driver, url):
    driver.get(url)
    time.sleep(3)

    try:
        product_title = driver.find_element(By.ID, "productTitle").text.strip()
        price = driver.find_element(By.CSS_SELECTOR, ".a-price .a-offscreen").text.strip()
        description = driver.find_element(By.ID, "feature-bullets").text.strip()

        product_data = {
            "title": product_title,
            "price": price,
            "description": description,
            "url": url,
            "source": "amazon"
        }

        insert_product(product_data)
        return product_data
    except Exception as e:
        print(f"Error scraping Amazon: {e}")
        return None
