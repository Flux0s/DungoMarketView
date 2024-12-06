"use client";

import { Har } from "har-format";

export default class UploadParser {
  static parseUpload(files: FileList): Promise<string> {
    return new Promise((resolve, reject) => {
      // Ensure the upload contains at least one file
      if (files.length === 0) {
        reject(new Error("No files selected for upload."));
        return;
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Verify the file type is .har
        if (!file?.name.endsWith(".har")) {
          reject(
            new Error(
              "Invalid file type! Only .har files are currently supported.",
            ),
          );
          return;
        }

        file
          .text()
          .then((text) => {
            const uploadContent: Har = JSON.parse(text);

            uploadContent.log.entries.forEach((entry) => {
              // Filter out non market-listing entries
              if (
                entry.request.url.startsWith(
                  "https://discord.com/api/v9/channels/1199910962443075614/messages",
                )
              ) {
                const content = entry.response.content.text;
                if (content) {
                  console.log(JSON.parse(content));
                }
              }
            });
          })
          .catch((error) => {
            reject(new Error(`Error parsing file ${i + 1}:`, error));
          });
      }
    });
  }
}
