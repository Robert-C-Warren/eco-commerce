from transformers import pipeline

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def summarize_title(title, max_words=5):
  try:
    summary = summarizer(title, max_length=max_words, min_length=1, do_sample=False)
    return summary[0]['summary_text']
  except Exception as e:
    print(f"Error sumarizing title: {e}")
    return title