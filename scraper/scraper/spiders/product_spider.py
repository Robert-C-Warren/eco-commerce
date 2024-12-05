import scrapy
from scraper.items import ProductItem

class ProductSpider(scrapy.Spider):
    name = "product_spider"
    start_urls = ['https://ecocommerce.com/eco-friendly-products']

    def parse(self, response):
        for product in response.css('.product-card'):
            yield ProductItem(
                name=product.css('.product-title::text').get(),
                description=product.css('.product-description::text').get(),
                link=product.css('.product-link::attr(href)').get(),
                eco_labels=product.css('.eco-labels span::text').getall()
            )

        pass