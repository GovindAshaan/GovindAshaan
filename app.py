
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

# 2. Hide Streamlit Branding & Fix Layout
st.markdown("""
    <style>
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    .block-container {padding: 0; max-width: 100%;}
    iframe {border: none; width: 100%;}
    body { background-color: #f8fafc; }
    </style>
""", unsafe_allow_html=True)

# 3. Handle API Key
# Priority: Streamlit Secrets -> Environment Variables
api_key = st.secrets.get("API_KEY", os.environ.get("API_KEY", ""))

# 4. Load the React App
try:
    # We read the index.html which will then load index.tsx as a module
    with open("index.html", "r", encoding="utf-8") as f:
        html_content = f.read()
    
    # We can inject the API key directly into the window object for the frontend to pick up
    # Note: process.env.API_KEY is handled by the platform, but this ensures a fallback
    injection = f"<script>window.process = {{ env: {{ API_KEY: '{api_key}' }} }};</script>"
    final_html = html_content.replace("<head>", f"<head>{injection}")

    # Display the component
    components.html(final_html, height=1800, scrolling=True)

except FileNotFoundError:
    st.error("Deployment Error: 'index.html' not found in root directory. Please check your GitHub repository structure.")
except Exception as e:
    st.error(f"Application Error: {str(e)}")
