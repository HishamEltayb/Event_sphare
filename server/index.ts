import express from 'express';
import cors from 'cors';
import * as docx from 'docx';
import { Document, Paragraph, HeadingLevel, AlignmentType } from 'docx';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/events/generate-report', async (req, res) => {
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

    // Set headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename=supplier-report.docx');
    
    // Send the buffer
    res.send(buffer);

  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Error generating report' });
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
}); 