
import streamlit as st
import streamlit.components.v1 as components
import os

# 1. Page Configuration
st.set_page_config(
    page_title="Ashan Career Domination AI",
    page_icon="🎯",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# 2. Hide Streamlit Chrome
st.markdown("""
    <style>
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    .block-container {padding: 0; max-width: 100%;}
    iframe {border: none; width: 100%; height: 100vh;}
    </style>
""", unsafe_allow_html=True)

# 3. Handle API Key
# For Streamlit Cloud, the key must be in the "Secrets" section.
api_key = st.secrets.get("API_KEY", os.environ.get("API_KEY", ""))

# 4. Load & Serve Application
try:
    with open("index.html", "r", encoding="utf-8") as f:
        html_content = f.read()
    
    # Inject API Key into window.process.env for the frontend
    injection = f"<script>window.process = {{ env: {{ API_KEY: '{api_key}' }} }};</script>"
    final_html = html_content.replace("<head>", f"<head>{injection}")

    # Increase height to ensure it covers the scrollable content
    components.html(final_html, height=2000, scrolling=True)

except FileNotFoundError:
    st.error("Error: index.html not found. Ensure it is in the same directory as app.py.")
except Exception as e:
    st.error(f"Application Error: {str(e)}")
