from rag_pipeline.indexing import rerank_chunks, load_vector_store

def retrieve_question(query):
    vector_store = load_vector_store()
    embedding_query = query
    raw_results = vector_store.similarity_search_with_score(embedding_query, k=8)
    raw_chunks = [doc for doc, _ in raw_results]

    reranked_chunks = rerank_chunks(query, raw_chunks)
    return reranked_chunks
