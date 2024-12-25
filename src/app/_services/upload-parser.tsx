"use client";

import { Har } from "har-format";

export default class UploadParser {
  static parseUpload(files: FileList): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
      // Ensure the upload contains at least one file
      if (files.length === 0) {
        reject(new Error("No files selected for upload."));
        return;
      }

      const filePromises: Promise<string>[] = [];

      for (const file of files) {
        // Verify the file type is .har
        if (!file?.name.endsWith(".har")) {
          reject(
            new Error(
              "Invalid file type! Only .har files are currently supported.",
            ),
          );
          return;
        }

        filePromises.push(file.text());
      }

      try {
        const results = await Promise.all(filePromises);
        results.forEach((text, index) => {
          try {
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
          } catch (error) {
            reject(new Error(`Error parsing file ${index + 1}:`, error));
          }
        });
        resolve(results);
      } catch (error) {
        reject(error);
      }
    });
  }
}
