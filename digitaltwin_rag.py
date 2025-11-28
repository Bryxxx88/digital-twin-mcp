"""
Digital Twin RAG Application
Interactive Q&A system using Upstash Vector for semantic search and Groq for AI responses
"""

import os
import json
from dotenv import load_dotenv
from upstash_vector import Index
from groq import Groq

# Load environment variables
load_dotenv()

# Constants
JSON_FILE = "digitaltwin.json"
GROQ_API_KEY = os.getenv('GROQ_API_KEY')
DEFAULT_MODEL = "llama-3.1-8b-instant"

def setup_groq_client():
    """Setup Groq client for AI inference"""
    if not GROQ_API_KEY:
        print("❌ GROQ_API_KEY not found in .env file")
        return None
    
    try:
        client = Groq(api_key=GROQ_API_KEY)
        print("✅ Groq client initialized successfully!")
        return client
    except Exception as e:
        print(f"❌ Error initializing Groq client: {str(e)}")
        return None

def setup_vector_database():
    """Setup Upstash Vector database connection"""
    print("🔄 Setting up Upstash Vector database...")
    
    try:
        index = Index.from_env()
        print("✅ Connected to Upstash Vector successfully!")
        
        # Check current vector count
        try:
            info = index.info()
            current_count = getattr(info, 'vector_count', 0)
            print(f"📊 Current vectors in database: {current_count}")
            
            if current_count == 0:
                print("⚠️  Warning: Database is empty!")
                print("Run 'python embed_digitaltwin.py' to load your profile data")
                return None
        except:
            print("⚠️  Could not verify database status")
        
        return index
        
    except Exception as e:
        print(f"❌ Error setting up database: {str(e)}")
        return None

def query_vectors(index, query_text, top_k=3):
    """Query Upstash Vector for similar content"""
    try:
        results = index.query(
            data=query_text,
            top_k=top_k,
            include_metadata=True
        )
        return results
    except Exception as e:
        print(f"❌ Error querying vectors: {str(e)}")
        return None

def generate_response_with_groq(client, prompt, model=DEFAULT_MODEL):
    """Generate AI response using Groq"""
    try:
        completion = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": """You are John Bryx Jovellanos' AI digital twin. Answer questions ONLY about his professional background, skills, education, and career goals.

IMPORTANT RULES:
1. Speak in first person as if you are John Bryx
2. Only answer questions about professional topics: technical skills, projects, education, work experience, career goals
3. If asked about personal information NOT in the profile (age, family, marital status, religion, politics), respond: "Unfortunately, my profile data does not include that information. As a digital twin representing a professional, I maintain a high level of professionalism and discretion. However, I can discuss my expertise, experience, skills, or projects. What would you like to know about my professional background?"
4. If asked about unrelated topics (weather, sports, entertainment, general knowledge), respond: "I appreciate your question, but that topic is outside the scope of my professional profile. As John Bryx's digital twin, I'm here to discuss technical skills, work experience, educational background, projects, and career goals. What would you like to know about my web development expertise or career aspirations?"
5. Provide specific examples with metrics and achievements when available
6. Be professional, confident, and helpful"""
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        return completion.choices[0].message.content.strip()
        
    except Exception as e:
        return f"❌ Error generating response: {str(e)}"

def rag_query(index, groq_client, question):
    """Perform RAG query using Upstash Vector + Groq"""
    try:
        # Step 1: Query vector database for relevant content
        print("\n🧠 Searching professional profile...")
        results = query_vectors(index, question, top_k=3)
        
        if not results or len(results) == 0:
            return "I don't have specific information about that topic in my profile."
        
        # Step 2: Extract relevant content
        top_docs = []
        for result in results:
            metadata = result.metadata or {}
            title = metadata.get('title', 'Information')
            content = metadata.get('content', '')
            score = result.score
            
            print(f"🔹 Found: {title} (Relevance: {score:.3f})")
            if content:
                top_docs.append(f"{title}: {content}")
        
        if not top_docs:
            return "I found some information but couldn't extract details."
        
        print(f"⚡ Generating personalized response...\n")
        
        # Step 3: Generate response with context
        context = "\n\n".join(top_docs)
        prompt = f"""Based on the following information about yourself, answer the question.
Speak in first person as if you are describing your own background.

Your Information:
{context}

Question: {question}

Provide a helpful, professional response:"""
        
        response = generate_response_with_groq(groq_client, prompt)
        return response
    
    except Exception as e:
        return f"❌ Error during query: {str(e)}"

def main():
    """Main application loop"""
    print("🤖 Your Digital Twin - AI Profile Assistant")
    print("=" * 50)
    print("🔗 Vector Storage: Upstash (built-in embeddings)")
    print(f"⚡ AI Inference: Groq ({DEFAULT_MODEL})")
    print("📋 Data Source: Your Professional Profile\n")
    
    # Setup clients
    groq_client = setup_groq_client()
    if not groq_client:
        return
    
    index = setup_vector_database()
    if not index:
        return
    
    print("✅ Your Digital Twin is ready!\n")
    
    # Interactive chat loop
    print("🤖 Chat with your AI Digital Twin!")
    print("Ask questions about your experience, skills, projects, or career goals.")
    print("Type 'exit' to quit.\n")
    
    print("💭 Try asking:")
    print("  - 'Tell me about your work experience'")
    print("  - 'What are your technical skills?'")
    print("  - 'Describe your University Clearance System project'")
    print("  - 'What are your career goals?'")
    print()
    
    while True:
        question = input("You: ")
        if question.lower() in ["exit", "quit", "q"]:
            print("👋 Thanks for chatting with your Digital Twin!")
            break
        
        if question.strip():
            answer = rag_query(index, groq_client, question)
            print(f"\n🤖 Digital Twin: {answer}\n")

if __name__ == "__main__":
    main()
