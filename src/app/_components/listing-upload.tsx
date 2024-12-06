"use client";
import React, { useRef } from "react";
import { Upload } from "lucide-react";

import { Button } from "~/app/_components/button";

export default function ButtonIcon() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent) => {
    
    console.log(event.target.files);
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
