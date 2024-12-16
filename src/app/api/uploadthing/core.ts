/* eslint-disable @typescript-eslint/no-unused-vars */
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import {auth} from "@/auth"
const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {

    // TODO : replace this wiht next auth
      const session = await auth();
 
      if (!session) throw new UploadThingError("Unauthorized");

      return { userId: session.user?.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // metadata -> store file in the db with the userid

      // just returning the file url to the frontend
      return { url:file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
