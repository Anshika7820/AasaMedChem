import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    message: "Demo app uses local browser storage. Connect Prisma/Neon using prisma/schema.prisma for production APIs."
  });
}
