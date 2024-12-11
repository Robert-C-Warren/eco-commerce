from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from transformers import pipeline

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def summarize_title(title, max_length=10, min_length=5):
    try:
        summary = summarizer(title, max_length=max_length, min_length=min_length, truncation=True)
        return summary[0]['summary_text']
    except Exception as e:
        print(f"Error summarizing title: {e}")
        return title

def scrape_lochtree(driver, url, db):
    base_url = "https://lochtree.com"

    try:
        driver.get(url)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "product-wrap"))
        )

        products = driver.find_elements(By.CLASS_NAME, "product-thumbnail")

        for product in products:
            try:
                # Extract title
                title = product.find_element(By.CLASS_NAME, "product-thumbnail__title").text.strip()
            except Exception:
                title = "Title not found"

            try:
                # Extract price
                price = product.find_element(By.CLASS_NAME, "money").text.strip()
            except Exception:
                price = "Price not found"

            try:
                # Extract product link
                link_element = product.find_element(By.CLASS_NAME, "product-thumbnail__title")
                relative_link = link_element.get_attribute("href")
                product_link = base_url + relative_link if relative_link.startswith("/") else relative_link
            except Exception:
                product_link = "Link not found"

            try:
                image_link = product.find_element(By.CLASS_NAME, "product-thumbnail__image").get_attribute("src")
            except Exception:
                image_link = "Image not found"

            # Prepare product data
            summary = summarize_title(title)
            product_data = {
                "title": title,
                "summary": summary,
                "price": price,
                "url": product_link,
                "image": image_link,
                "source": "lochtree",
                "visible": False,
            }

            # Insert into MongoDB
            db.products.insert_one(product_data)
            print(f"Inserted product: {product_data}")

    except Exception as e:
        print(f"Error scraping lochtree: {e}")
        return None