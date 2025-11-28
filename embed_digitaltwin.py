"""
Digital Twin Profile Embedding Script
Loads digitaltwin.json and uploads content chunks to Upstash Vector database
"""

import os
import json
from dotenv import load_dotenv
from upstash_vector import Index

# Load environment variables
load_dotenv()

# Configuration
JSON_FILE = "digitaltwin.json"
UPSTASH_VECTOR_REST_URL = os.getenv('UPSTASH_VECTOR_REST_URL')
UPSTASH_VECTOR_REST_TOKEN = os.getenv('UPSTASH_VECTOR_REST_TOKEN')

def setup_vector_database():
    """Initialize Upstash Vector database connection"""
    print("🔄 Connecting to Upstash Vector database...")
    
    if not UPSTASH_VECTOR_REST_URL or not UPSTASH_VECTOR_REST_TOKEN:
        print("❌ Error: Upstash credentials not found in .env file")
        print("Please set UPSTASH_VECTOR_REST_URL and UPSTASH_VECTOR_REST_TOKEN")
        return None
    
    try:
        # Use from_env() method as it's more reliable
        index = Index.from_env()
        print("✅ Connected to Upstash Vector successfully!")
        print(f"📍 URL: {UPSTASH_VECTOR_REST_URL}")
        return index
    except Exception as e:
        print(f"❌ Error connecting to Upstash Vector: {str(e)}")
        print("Trying alternative connection method...")
        try:
            index = Index(
                url=UPSTASH_VECTOR_REST_URL,
                token=UPSTASH_VECTOR_REST_TOKEN
            )
            print("✅ Connected using alternative method!")
            return index
        except Exception as e2:
            print(f"❌ Alternative method also failed: {str(e2)}")
            return None

def load_profile_data():
    """Load professional profile from JSON file"""
    print(f"📂 Loading profile data from {JSON_FILE}...")
    
    try:
        with open(JSON_FILE, "r", encoding="utf-8") as f:
            profile_data = json.load(f)
        print("✅ Profile data loaded successfully!")
        return profile_data
    except FileNotFoundError:
        print(f"❌ Error: {JSON_FILE} not found!")
        return None
    except json.JSONDecodeError as e:
        print(f"❌ Error: Invalid JSON format in {JSON_FILE}: {str(e)}")
        return None

def prepare_vectors(profile_data):
    """Prepare vectors from profile content chunks"""
    print("🔄 Preparing vectors from content chunks...")
    
    content_chunks = profile_data.get('content_chunks', [])
    
    if not content_chunks:
        print("❌ Error: No content chunks found in profile data")
        print("Make sure your digitaltwin.json has a 'content_chunks' array")
        return None
    
    vectors = []
    for chunk in content_chunks:
        # Create enriched text combining title and content
        enriched_text = f"{chunk['title']}: {chunk['content']}"
        
        # Prepare vector tuple: (id, text, metadata)
        vector = (
            chunk['id'],
            enriched_text,
            {
                "title": chunk['title'],
                "type": chunk['type'],
                "content": chunk['content'],
                "category": chunk.get('metadata', {}).get('category', ''),
                "tags": chunk.get('metadata', {}).get('tags', [])
            }
        )
        vectors.append(vector)
    
    print(f"✅ Prepared {len(vectors)} vectors for upload")
    return vectors

def upload_vectors(index, vectors):
    """Upload vectors to Upstash Vector database"""
    print("🚀 Uploading vectors to Upstash Vector...")
    
    try:
        # Upsert vectors (will update if they already exist)
        result = index.upsert(vectors=vectors)
        print(f"✅ Successfully uploaded {len(vectors)} content chunks!")
        print(f"📊 Upload result: {result}")
        return True
    except Exception as e:
        print(f"❌ Error uploading vectors: {str(e)}")
        print(f"📝 Error details: {type(e).__name__}")
        
        # Try uploading one by one if batch fails
        print("🔄 Attempting individual uploads...")
        success_count = 0
        for vector in vectors:
            try:
                index.upsert(vectors=[vector])
                success_count += 1
            except Exception as upload_error:
                print(f"❌ Failed to upload vector {vector[0]}: {str(upload_error)}")
        
        if success_count > 0:
            print(f"✅ Successfully uploaded {success_count}/{len(vectors)} vectors individually")
            return True
        return False

def verify_upload(index):
    """Verify the upload by checking vector count"""
    print("🔍 Verifying upload...")
    
    try:
        info = index.info()
        vector_count = getattr(info, 'vector_count', 0)
        print(f"✅ Database now contains {vector_count} vectors")
        return True
    except Exception as e:
        print(f"⚠️  Could not verify upload: {str(e)}")
        return False

def main():
    """Main embedding process"""
    print("🤖 Digital Twin Profile Embedding Script")
    print("=" * 50)
    
    # Step 1: Connect to Upstash Vector
    index = setup_vector_database()
    if not index:
        return
    
    # Step 2: Load profile data
    profile_data = load_profile_data()
    if not profile_data:
        return
    
    # Step 3: Prepare vectors
    vectors = prepare_vectors(profile_data)
    if not vectors:
        return
    
    # Step 4: Upload vectors
    if not upload_vectors(index, vectors):
        return
    
    # Step 5: Verify upload
    verify_upload(index)
    
    print("\n✅ Embedding process completed successfully!")
    print("Your digital twin profile is now ready for RAG queries.")

if __name__ == "__main__":
    main()
