import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Document, Paragraph, HeadingLevel, AlignmentType, Packer } from 'npm:docx'

serve(async (req) => {
  try {
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

    const buffer = await Packer.toBuffer(doc);

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename=supplier-report.docx',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error generating report' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}) 