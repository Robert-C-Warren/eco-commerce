from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup


def scrape_lochtree(driver, url, db):
    base_url = "https://lochtree.com"

    try:
        print("Navigating to Lochtree URL...")
        driver.get(url)

        print("Waiting for products to load...")
        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.CLASS_NAME, "product-wrap"))
        )
        print("Page loaded successfully!")

        # Locate all products
        products = driver.find_elements(By.CLASS_NAME, "product-wrap")
        print(f"Found {len(products)} products on the page.")

        for product in products:
            try:
                # Extract title
                print("Extracting title...")
                title = product.find_element(By.CLASS_NAME, "product-thumbnail__title").text.strip()
                #title = title_element.get_attribute("title").strip() if title_element else "Title not found"
                print(f"Title: {title}")
            except Exception as e:
                title = "Title not found"
                print(f"Error extracting title: {e}")

            try:
                # Extract price
                print("Extracting price...")
                price = product.find_element(By.CLASS_NAME, "money").text.strip()
                print(f"Price: {price}")
            except Exception as e:
                price = "Price not found"
                print(f"Error extracting price: {e}")

            try:
                # Extract product link
                print("Extracting product link...")
                link_element = product.find_element(By.CSS_SELECTOR, ".product-image__wrapper a")
                relative_link = link_element.get_attribute("href")
                product_link = base_url + relative_link if relative_link.startswith("/") else relative_link
                print(f"Product link: {product_link}")
            except Exception as e:
                product_link = "Link not found"
                print(f"Error extracting link: {e}")

            try:
                # Extract image from <noscript> tag
                print("Extracting image from noscript...")
                noscript_element = product.find_element(By.CLASS_NAME, "noscript")
                noscript_html = noscript_element.get_attribute("innerHTML")
                soup = BeautifulSoup(noscript_html, "html.parser")
                img_tag = soup.find("img")
                if img_tag and "src" in img_tag.attrs:
                    img_src = img_tag["src"]
                    if img_src.startswith("//"):
                        img_src = "https:" + img_src
                else:
                    img_src = "Image not found"
                print(f"Image URL: {img_src}")
            except Exception as e:
                img_src = "Image not found"
                print(f"Error extracting image: {e}")

            # Prepare product data

            product_data = {
                "title": title,
                "summary": title,
                "price": price,
                "url": product_link,
                "image": img_src,
                "source": "Lochtree",
                "visible": False,
            }

            # Insert into MongoDB
            print(f"Inserting product into database: {product_data}")
            db.products.insert_one(product_data)

    except Exception as e:
        print(f"Error scraping Lochtree: {e}")
