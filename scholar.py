import os
import glob
import sys
import warnings

# Suppress noisy warnings
warnings.filterwarnings("ignore")

try:
    from langchain_community.document_loaders import PyPDFLoader
    from langchain_text_splitters import RecursiveCharacterTextSplitter
    from langchain_huggingface import HuggingFaceEmbeddings
    from langchain_chroma import Chroma
except ImportError:
    print("❌ MISSING LIBRARIES for Scholar.")
    sys.exit(1)

# CONFIGURATION
KB_FOLDER = "knowledge_base"
DB_DIR = "memory_bank"

def initialize_brain():
    print("\n🧠 SCHOLAR SYSTEM INITIALIZING...")
    
    if not os.path.exists(KB_FOLDER):
        os.makedirs(KB_FOLDER)
        print(f"⚠️ Created missing folder: '{KB_FOLDER}'")
        return None

    pdf_files = glob.glob(os.path.join(KB_FOLDER, "*.pdf"))
    if not pdf_files:
        print(f"⚠️ EMPTY FOLDER: No PDFs found in '{KB_FOLDER}'. Brain is empty.")
        return None

    print(f"📚 Found {len(pdf_files)} documents. Loading...")

    documents = []
    for pdf in pdf_files:
        try:
            loader = PyPDFLoader(pdf)
            documents.extend(loader.load())
            print(f"   ✅ Digesting: {os.path.basename(pdf)}")
        except Exception as e:
            print(f"   ❌ Failed to read {pdf}: {e}")

    if not documents:
        return None

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    chunks = text_splitter.split_documents(documents)

    print(f"💾 Saving {len(chunks)} knowledge fragments...")

    # FAIL-SAFE: Try to download model, but don't crash if offline
    try:
        embedding_fn = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        vector_db = Chroma.from_documents(
            documents=chunks, 
            embedding=embedding_fn, 
            persist_directory=DB_DIR
        )
        print("🎓 GRADUATION COMPLETE. The Scholar is ready.")
        return vector_db
        
    except Exception as e:
        print(f"\n⚠️ NETWORK ERROR: Could not download Brain Model.")
        print(f"   Details: {e}")
        print("👉 STARTING JARVIS IN 'WITHOUT BRAIN' MODE.")
        return None
        