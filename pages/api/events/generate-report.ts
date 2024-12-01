import { NextApiRequest, NextApiResponse } from 'next';
import * as docx from 'docx';
import { Document, Paragraph, TextRun, Table, TableRow, TableCell, BorderStyle } from 'docx';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const eventData = req.body;

    // Create document
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
          new Paragraph({
            text: `Event: ${eventData.name}`,
            heading: HeadingLevel.HEADING_2,
            spacing: {
              after: 200,
            },
          }),
          new Paragraph({
            text: `Date: ${new Date(eventData.date).toLocaleDateString()}`,
            spacing: {
              after: 200,
            },
          }),
          // Add more event details...
          new Paragraph({
            text: "Suppliers",
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 200,
              after: 200,
            },
          }),
          // Create a table for suppliers
          new Table({
            rows: [
              // Header row
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Supplier Name")] }),
                  new TableCell({ children: [new Paragraph("Status")] }),
                  new TableCell({ children: [new Paragraph("Budget")] }),
                ],
              }),
              // Data rows
              ...eventData.event_suppliers.map((supplier: any) => 
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(supplier.supplier.name)] }),
                    new TableCell({ children: [new Paragraph(supplier.status)] }),
                    new TableCell({ children: [new Paragraph(`$${supplier.allocated_budget}`)] }),
                  ],
                })
              ),
            ],
          }),
        ],
      }],
    });

    // Generate the document buffer
    const buffer = await docx.Packer.toBuffer(doc);

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=event-report.docx`);
    
    // Send the buffer
    res.send(buffer);

  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Error generating report' });
  }
} 