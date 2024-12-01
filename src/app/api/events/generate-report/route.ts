import { NextResponse } from 'next/server';
import * as docx from 'docx';
import { Document, Paragraph, HeadingLevel, AlignmentType } from 'docx';

export async function POST(request: Request) {
  try {
    // Create a simple document with just a header
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "Supplier Report",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
            },
          }),
        ],
      }],
    });

    // Generate the document buffer
    const buffer = await docx.Packer.toBuffer(doc);

    // Return the response with appropriate headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename=supplier-report.docx',
      },
    });

  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Error generating report' }, { status: 500 });
  }
} 