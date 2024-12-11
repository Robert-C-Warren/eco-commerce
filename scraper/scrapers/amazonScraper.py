from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from fake_useragent import UserAgent
from transformers import pipeline

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def setup_driver():
    options = Options()
    ua = UserAgent()
    user_agent = ua.random
    options.add_argument(f"user-agent={user_agent}")
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    return webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

def summarize_title(title, max_length=10, min_length=5):
    try:
        summary = summarizer(title, max_length=max_length, min_length=min_length, truncation=True)
        return summary[0]['summary_text']
    except Exception as e:
        print(f"Error summarizing title: {e}")
        return title

def scrape_amazon(driver, url, db):
    try:
        driver.get(url)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".s-main-slot"))
        )

        products = driver.find_elements(By.CSS_SELECTOR, ".s-main-slot .s-result-item")

        for product in products:
            try:
                title = product.find_element(By.CSS_SELECTOR, ".a-size-base-plus.a-color-base.a-text-normal").text.strip()
            except Exception:
                title = "Title not found"

            try:
                price_whole = product.find_element(By.CSS_SELECTOR, ".a-price-whole").text.strip()
                price_fraction = product.find_element(By.CSS_SELECTOR, ".a-price-fraction").text.strip()
                price = f"${price_whole}.{price_fraction}"
            except Exception:
                price = "Price not found"

            try:
                link = product.find_element(By.CSS_SELECTOR, "a.a-link-normal.s-no-outline").get_attribute("href")
            except Exception:
                link = "Link not found"

            try:
                image_link = product.find_element(By.CSS_SELECTOR, ".s-image").get_attribute("src")
            except Exception:
                image_link = "Image not found"

            summary = summarize_title(title)

            product_data = {
                "title": title,
                "summary": summary,
                "price": price,
                "url": link,
                "image": image_link,
                "source": "Amazon",
                "visible": False,
            }    

            db.products.insert_one(product_data)
            print(f"Inserted product: {product_data}")

    except Exception as e:
        print(f"Error scrapin Amazon: {e}")