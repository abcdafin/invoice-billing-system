import * as React from 'react';
import { Document, Page, Text, View, StyleSheet, renderToStream } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Define fonts - using default but extensible
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#333'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 20
  },
  logo: {
    width: 120,
    height: 40,
    objectFit: 'contain'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366', // Brand Navy
    marginBottom: 10
  },
  infoGroup: {
    marginBottom: 4
  },
  label: {
    color: '#666',
    width: 80
  },
  value: {
    fontWeight: 'bold',
    color: '#000'
  },
  section: {
    marginBottom: 30
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
    marginBottom: 10,
    textTransform: 'uppercase'
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#003366',
    paddingBottom: 5,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#003366'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8
  },
  col1: { width: '40%' },
  col2: { width: '15%', textAlign: 'right' },
  col3: { width: '20%', textAlign: 'right' },
  col4: { width: '25%', textAlign: 'right' },
  
  summaryBox: {
    width: '40%',
    marginLeft: 'auto',
    marginTop: 20
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 2,
    borderTopColor: '#003366',
    marginTop: 4,
    fontWeight: 'bold',
    fontSize: 12,
    color: '#003366'
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    color: '#666',
    fontSize: 8
  }
});

interface InvoicePDFProps {
  invoice: any; // Ideally full Prisma Invoice including relations
}

const InvoiceDocument = ({ invoice }: InvoicePDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>INVOICE</Text>
          <View style={styles.infoGroup}>
            <Text><Text style={styles.label}>Invoice #:</Text> <Text style={styles.value}>{invoice.invoiceNumber}</Text></Text>
          </View>
          <View style={styles.infoGroup}>
            <Text><Text style={styles.label}>Issue Date:</Text> <Text style={styles.value}>{format(new Date(invoice.issueDate), 'dd MMM yyyy')}</Text></Text>
          </View>
          <View style={styles.infoGroup}>
            <Text><Text style={styles.label}>Due Date:</Text> <Text style={styles.value}>{format(new Date(invoice.dueDate), 'dd MMM yyyy')}</Text></Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          {/* Cannot dynamically fetch absolute local images without tricky pathing on backend, providing fallback text layout */}
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FF6A00' }}>Your Company Name</Text>
          <Text>123 Business Road, Suite 100</Text>
          <Text>Jakarta, Indonesia 12345</Text>
        </View>
      </View>

      {/* Bill To */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bill To</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 4 }}>{invoice.client?.name}</Text>
        {invoice.client?.address && <Text>{invoice.client.address}</Text>}
        <Text>{invoice.client?.city} {invoice.client?.postalCode ? `, ${invoice.client.postalCode}` : ''}</Text>
        {invoice.client?.country && <Text>{invoice.client.country}</Text>}
        {invoice.client?.email && <Text style={{ marginTop: 4 }}>{invoice.client.email}</Text>}
      </View>

      {/* Line Items */}
      <View style={styles.section}>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Item</Text>
            <Text style={styles.col2}>Qty</Text>
            <Text style={styles.col3}>Unit Price</Text>
            <Text style={styles.col4}>Total</Text>
          </View>
          
          {invoice.items?.map((item: any, i: number) => (
            <View style={styles.tableRow} key={i}>
              <View style={styles.col1}>
                <Text style={{ fontWeight: 'bold' }}>{item.product?.name || 'Item'}</Text>
                {item.description && <Text style={{ color: '#666', fontSize: 8 }}>{item.description}</Text>}
              </View>
              <Text style={styles.col2}>{Number(item.quantity)}</Text>
              <Text style={styles.col3}>Rp {Number(item.unitPrice).toLocaleString()}</Text>
              <Text style={styles.col4}>Rp {Number(item.subtotal).toLocaleString()}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text>Subtotal</Text>
            <Text>Rp {Number(invoice.subtotal).toLocaleString()}</Text>
          </View>
          {Number(invoice.discountAmount) > 0 && (
            <View style={styles.summaryRow}>
              <Text>Discount</Text>
              <Text>- Rp {Number(invoice.discountAmount).toLocaleString()}</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text>Tax</Text>
            <Text>Rp {Number(invoice.taxAmount).toLocaleString()}</Text>
          </View>
          <View style={styles.summaryTotal}>
            <Text>Total Due</Text>
            <Text>Rp {Number(invoice.total).toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* Footer Notes */}
      <View style={styles.section}>
        {invoice.notes && (
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Notes:</Text>
            <Text>{invoice.notes}</Text>
          </View>
        )}
        {invoice.terms && (
          <View>
            <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Terms & Conditions:</Text>
            <Text>{invoice.terms}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Text>Thank you for your business. Generated by Invoice & Billing System.</Text>
      </View>

    </Page>
  </Document>
);

export const generateInvoicePDF = async (invoice: any): Promise<NodeJS.ReadableStream> => {
   return await renderToStream(<InvoiceDocument invoice={invoice} />);
};
