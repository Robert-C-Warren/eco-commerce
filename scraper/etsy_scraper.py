from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from pymongo import MongoClient
import time


class EtsyScraper:
    def __init__(self):
        # Initialize WebDriver
        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        self.driver.implicitly_wait(10)
        # MongoDB setup
        self.client = MongoClient("mongodb://localhost:27017/")
        self.db = self.client["eco_commerce"]
        self.collection = self.db["etsy_products"]

    def scrape_etsy(self):
        url = "https://www.etsy.com/search?q=eco+friendly+products&ref=search_bar&dd_referrer=https%3A%2F%2Fwww.etsy.com%2F&order=date_desc"
        self.driver.get(url)
        time.sleep(5)

        products = self.driver.find_elements(By.XPATH, '//div[@data-listing-id]')

        for product in products:
            try:
                # Extract product details
                title = product.find_element(By.XPATH, './/h3').text.strip()
                price = product.find_element(By.XPATH, './/span[@class="currency-value"]').text.strip()
                link = product.find_element(By.XPATH, './/a').get_attribute("href")
                seller = product.find_element(By.XPATH, './/h3').text.strip()