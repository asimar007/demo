import { VoyageEmbeddings } from "@langchain/community/embeddings/voyage";

const embeddings = new VoyageEmbeddings({
  apiKey: process.env.VOYAGEAI_API_KEY, // In Node.js defaults to process.env.VOYAGEAI_API_KEY
  inputType: "document", // Optional: specify input type as 'query', 'document', or omit for None / Undefined / Null
});

export const embedd = async (text: string) => {
  const embedding = await embeddings.embedQuery(text);
  return embedding;
};
