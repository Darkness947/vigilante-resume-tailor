import React from 'react';
import { Document, Page, StyleSheet } from '@react-pdf/renderer';
import Html from 'react-pdf-html';

const htmlStylesheet = {
  h1: { fontSize: 26, marginBottom: 10, fontWeight: 'bold', textAlign: 'right' },
  h2: { fontSize: 18, marginTop: 15, marginBottom: 6, borderBottom: '1px solid #333', paddingBottom: 2, fontWeight: 'bold', textAlign: 'right' },
  h3: { fontSize: 14, marginTop: 10, marginBottom: 4, fontWeight: 'bold', textAlign: 'right' },
  p: { fontSize: 12, marginBottom: 5, lineHeight: 1.5, textAlign: 'right' },
  ul: { marginBottom: 10, marginRight: 15, textAlign: 'right' },
  li: { fontSize: 12, marginBottom: 3, lineHeight: 1.4, textAlign: 'right' }
};

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Cairo', color: '#111' },
});

export function ArabicRtlTemplate({ htmlContent }: { htmlContent: string }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Html stylesheet={htmlStylesheet} collapse={false}>{htmlContent}</Html>
      </Page>
    </Document>
  );
}
