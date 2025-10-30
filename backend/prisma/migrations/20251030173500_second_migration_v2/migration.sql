-- CreateTable
CREATE TABLE "SeedData" (
    "id" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeedData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeedStudent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "seedDataId" TEXT NOT NULL,

    CONSTRAINT "SeedStudent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SeedData" ADD CONSTRAINT "SeedData_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohorts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeedStudent" ADD CONSTRAINT "SeedStudent_seedDataId_fkey" FOREIGN KEY ("seedDataId") REFERENCES "SeedData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
