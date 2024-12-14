from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from scrapers.ecoternativesScraper import scrape_ecoternatives
from scrapers.lochtreeScraper import scrape_lochtree
from scrapers.earttheroScraper import scrape_earthhero
from pymongo import MongoClient

def setup_driver():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    return webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)


def main():
    client = MongoClient("mongodb://localhost:27017/")

    db = client["eco_commerce"]

    driver = setup_driver()

    urls = {
        "ecoternatives": "https://ecoternatives.co/collections/all?sort_by=created-descending",
        "lochtree": "https://lochtree.com/collections/new-at-lochtree",
        "earthhero": "https://earthhero.com/collections/new-arrivals",
    }

    for site, url in urls.items():
        if site == "ecoternatives":
            scrape_ecoternatives(driver, url, db)
        elif site == "lochtree":
            scrape_lochtree(driver, url, db)
        elif site == "earthhero":
            scrape_earthhero(driver, url, db)

    driver.quit()

if __name__ == "__main__":
    main()