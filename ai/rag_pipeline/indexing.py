from pathlib import Path
import json
from langchain_core.documents import Document
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from sentence_transformers import CrossEncoder
from langchain_community.vectorstores.utils import DistanceStrategy

INDEX_PATH = "faiss_index_questions"
QUESTIONS_PATH = "data/"

embedding_model = HuggingFaceEmbeddings(
    model_name="BAAI/bge-base-en-v1.5",
    encode_kwargs={"normalize_embeddings": True}
)

reranker_model = CrossEncoder('BAAI/bge-reranker-large')

def load_all_questions(folder_path=QUESTIONS_PATH):
    all_docs = []
    for json_file in Path(folder_path).glob("*.json"):
        with open(json_file, "r", encoding="utf-8") as f:
            question_data = json.load(f)
            summary = question_data.get("summary", "")
            metadata = {
                "title": question_data.get("title"),
                "description": question_data.get("description"),
                "solution": question_data.get("solution"),
                "notes": question_data.get("notes")
            }
            all_docs.append(Document(page_content=summary, metadata=metadata))
    print(f"Loaded {len(all_docs)} question documents.")
    return all_docs

def create_vector_store():
    question_docs = load_all_questions()
    vector_store = FAISS.from_documents(
        question_docs,
        embedding=embedding_model,
        distance_strategy=DistanceStrategy.COSINE
    )
    vector_store.save_local(INDEX_PATH)
    return vector_store

def load_vector_store():
    if Path(INDEX_PATH).exists():
        return FAISS.load_local(
            INDEX_PATH,
            embedding_model,
            distance_strategy=DistanceStrategy.COSINE,
            allow_dangerous_deserialization=True
        )
    else:
        return create_vector_store()

def rerank_chunks(query, chunks):
    pairs = [(query, chunk.page_content) for chunk in chunks]
    scores = reranker_model.predict(pairs)
    scored_chunks = list(zip(chunks, scores))
    reranked = sorted(scored_chunks, key=lambda x: x[1], reverse=True)

    for i, (chunk, score) in enumerate(reranked):
        print(f"{i+1}. Rerank Score: {score:.4f} - {chunk.metadata['title']}")

    return [chunk for chunk, score in reranked if score > 0.6]