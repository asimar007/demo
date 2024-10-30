// AddVideo.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAction } from "convex/react";
import React, { useState } from "react";
import { api } from "../../../../convex/_generated/api";

export const AddVideo = () => {
  const addVideo = useAction(api.video.addVideo);

  const [video, setVideo] = useState({
    title: "",
    url: "",
    description: "",
    thumbnail: "",
    category: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideo({ ...video, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addVideo(video)
      .then(() => {
        console.log("Video added successfully");
        alert("Video Added");
      })
      .catch((err) => {
        console.error("Error adding video:", err);
        alert("Upload error");
      });
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="text"
          placeholder="Title"
          name="title"
          onChange={handleChange}
        />
        <Input
          type="text"
          placeholder="URL"
          name="url"
          onChange={handleChange}
        />
        <Input
          type="text"
          placeholder="Description"
          name="description"
          onChange={handleChange}
        />
        <Input
          type="text"
          placeholder="Thumbnail"
          name="thumbnail"
          onChange={handleChange}
        />
        <Input
          type="text"
          placeholder="Category"
          name="category"
          onChange={handleChange}
        />
        <Button disabled={!addVideo} type="submit">
          Add Video
        </Button>
      </form>
    </div>
  );
};
