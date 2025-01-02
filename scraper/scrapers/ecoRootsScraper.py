from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from selenium.webdriver.common.action_chains import ActionChains
import pymongo

def load_all_products(driver):
    last_height = driver.execute_script("return document.body.scrollHeight")
    while True:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)

        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height

def wait_for_images_to_load(driver):
    WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located(By.CLASS_NAME, "product-card-figure-ie")
    )

def scrape_ecoroot(driver, url, db):
    try:
        driver.get(url)
        
        # Load all products (for infinite scroll)
        load_all_products(driver)

        # Wait for product images to load
        wait_for_images_to_load(driver)

        # Locate all product cards
        products = driver.find_elements(By.CLASS_NAME, "product-inner")

        for product in products:
            try:
                # Extract product details
                title = product.find_element(By.CLASS_NAME, "product-card-figure-ie").get_attribute("aria-label").strip()
                price_element = product.find_element(By.CLASS_NAME, "product-card-interaction-addtocart")
                price = price_element.find_element(By.CLASS_NAME, "product-card-interaction-addtocart-available").text.strip() if price_element else "N/A"
                product_url = product.find_element(By.CLASS_NAME, "product-card-overlay").get_attribute("href").strip()
                
                # Extract image URL
                try:
                    style = product.find_element(By.CLASS_NAME, "product-card-figure-ie").get_attribute("style")
                    image_url = style.split("url(")[-1].split(")")[0].replace('"', '') if "url(" in style else None
                    if not image_url:
                        image_url = product.find_element(By.TAG_NAME, "img").get_attribute("src")
                except Exception as e:
                    image_url = None
                    print(f"Error extracting image: {e}")

                # Prepare product data
                product_data = {
                    "title": title,
                    "summary": title,
                    "price": price,
                    "url": product_url,
                    "image": image_url,
                    "source": "ecoroots",
                    "visible": False
                }

                # Insert into database
                print(f"Inserting product: {product_data}")
                db.products.insert_one(product_data)

            except pymongo.errors.DuplicateKeyError as e:
                print(f"Duplicate Key Error: {e}")
            except Exception as e:
                print(f"Error extracting product data: {e}")

    except Exception as e:
        print(f"Error loading EcoRoots page: {e}")
