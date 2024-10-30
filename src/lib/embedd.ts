import { VoyageEmbeddings } from "@langchain/community/embeddings/voyage";

//const key = process.env.NEXT_PUBLIC_VOYAGEAI_API_KEY;

const embeddings = new VoyageEmbeddings({
  apiKey: "pa-Vr3W90Cn31QNFnpytJwyIl7Pk48HKQYrIb9hPvK8BtY", // In Node.js defaults to process.env.VOYAGEAI_API_KEY
  inputType: "document", // Optional: specify input type as 'query', 'document', or omit for None / Undefined / Null
});

//console.log(process.env.VOYAGEAI_API_KEY);

export const embedd = async (text: string) => {
  const embedding = await embeddings.embedQuery(text);
  return embedding;
};
