-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "bucketKey" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "manifestUrn" TEXT,
    "filename" TEXT NOT NULL,
    "filepath" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "files_objectId_key" ON "files"("objectId");
