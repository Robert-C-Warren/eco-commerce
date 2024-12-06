from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def scrape_earthhero(driver, url, db):
    base_url = "https://www.earthhero.com"

    try:
        driver.get(url)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "boost-pfs-filter-product-bottom-inner"))
        )

        products = driver.find_elements(By.CLASS_NAME, "boost-pfs-filter-product-item")

        for product in products:
            try:
                # Extract title
                title = product.find_element(By.CLASS_NAME, "boost-pfs-filter-product-item-title").text.strip()
            except Exception:
                title = "Title not found"

            try:
                # Extract price
                price = product.find_element(By.CLASS_NAME, "boost-pfs-filter-product-item-regular-price").text.strip()
            except Exception:
                price = "Price not found"

            try:
                # Extract product link
                link_element = product.find_element(By.CLASS_NAME, "boost-pfs-filter-product-item-title")
                relative_link = link_element.get_attribute("href")
                product_link = base_url + relative_link if relative_link.startswith("/") else relative_link
            except Exception:
                product_link = "Link not found"

            # Prepare product data
            product_data = {
                "title": title,
                "price": price,
                "url": product_link,
                "source": "earthhero"
            }

            # Insert into MongoDB
            db.products.insert_one(product_data)
            print(f"Inserted product: {product_data}")

    except Exception as e:
        print(f"Error scraping EarthHero: {e}")
        return None
