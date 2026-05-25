-- Approval Workflow Tahap 2
-- Additive migration: histori approval, catatan revisi, dan status minta revisi.

CREATE TYPE "ApprovalAction" AS ENUM ('SUBMIT', 'APPROVE', 'REQUEST_REVISION', 'REJECT', 'COMMENT');

ALTER TABLE "Approval"
ADD COLUMN "requestedById" TEXT,
ADD COLUMN "actionRequiredRole" TEXT,
ADD COLUMN "currentStep" TEXT,
ADD COLUMN "revisionNote" TEXT,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "resolvedAt" TIMESTAMP(3);

CREATE TABLE "ApprovalHistory" (
    "id" TEXT NOT NULL,
    "approvalId" TEXT NOT NULL,
    "action" "ApprovalAction" NOT NULL,
    "statusBefore" "ApprovalStatus",
    "statusAfter" "ApprovalStatus" NOT NULL,
    "actorId" TEXT,
    "actorRole" TEXT,
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApprovalHistory_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Approval_status_createdAt_idx" ON "Approval"("status", "createdAt");
CREATE INDEX "Approval_requestedById_idx" ON "Approval"("requestedById");
CREATE INDEX "ApprovalHistory_approvalId_createdAt_idx" ON "ApprovalHistory"("approvalId", "createdAt");
CREATE INDEX "ApprovalHistory_actorId_idx" ON "ApprovalHistory"("actorId");

ALTER TABLE "Approval"
ADD CONSTRAINT "Approval_requestedById_fkey"
FOREIGN KEY ("requestedById") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ApprovalHistory"
ADD CONSTRAINT "ApprovalHistory_approvalId_fkey"
FOREIGN KEY ("approvalId") REFERENCES "Approval"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ApprovalHistory"
ADD CONSTRAINT "ApprovalHistory_actorId_fkey"
FOREIGN KEY ("actorId") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
