import sib_api_v3_sdk
from pymongo import MongoClient
from sib_api_v3_sdk.rest import ApiException
from datetime import datetime

def sendEmails(db):
    client = MongoClient("mongodb://localhost:27017")
    db = client["eco_commerce"]
    subscribers = db["subscribers"]
    products = db["products"]
    today = datetime.now().strftime("%Y-%m-%d")
    new_products = products.find({"date_scraped": today})

    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key["api-key"] = "6D4KmnVQw2SFMaYb"
    product_list = "\n".join([f"- {p['title']} ({p['url']})" for p in new_products])

    subject = "Today's new Eco-friendly products"
    body = f"Check out the latest from Eco-commerce: \n\n{product_list}"

    def send_emails():
        api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))

        for subscriber in subscribers.find():
            email = sib_api_v3_sdk.SendSmtpEmail(
                to=[{"email": subscriber["email"], "name": subscriber["name"]}],
                sender={"email": "robertcwarren1@gmail.com", "name": "Eco-commerce"},
                subject=subject,
                text_content=body
            )
            try:
                api_response = api_instance.send_transac_email(email)
                print(f"Email sent to {subscriber['email']}: {api_response['messageId']}")
            except ApiException as e:
                print(f"Error sending email to {subscriber['email']}: {e}")
