"use client";
import React, { useRef } from "react";
import UploadParser from "~/app/_services/upload-parser";

import { Upload } from "lucide-react";
import { Button } from "~/app/_components/button";

export default function ButtonIcon() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    UploadParser.parseUpload(event.target.files)
      .then((messages: string[]) => {
        console.log(messages);
      })
      .catch((error) => {
        console.error("Error parsing upload:", error);
      });
  };
  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload />
      </Button>
      <input
        onChange={handleChange}
        multiple={false}
        ref={fileInputRef}
        type="file"
        hidden
      />
    </div>
  );
}
